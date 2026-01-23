# ml/recommendation_engine.py
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class JobRecommender:
    def __init__(self):
        self.model = GradientBoostingClassifier(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.label_encoders = {}
        
    def preprocess_data(self, contractor_data, jobs_data):
        """Preprocess data for ML model"""
        # Contractor features
        contractor_features = [
            contractor_data.get('rating', 0),
            contractor_data.get('successRate', 0.5),
            contractor_data.get('experienceYears', 1),
            len(contractor_data.get('skills', [])),
            contractor_data.get('avgBidAmount', 50000) / 10000  # Normalize
        ]
        
        # Job features
        job_features_list = []
        for job in jobs_data:
            features = [
                job.get('budget', 0) / 10000,  # Normalize
                len(job.get('skillsRequired', [])),
                1 if job.get('location', {}).get('city') == contractor_data.get('location', {}).get('city') else 0,
                job.get('urgencyScore', 0.5),
                (pd.to_datetime(job.get('deadline')) - pd.Timestamp.now()).days / 30 if job.get('deadline') else 30 # Days to deadline
            ]
            job_features_list.append(features)
        
        return np.array(contractor_features), np.array(job_features_list)
    
    def calculate_similarity(self, contractor_features, job_features):
        """Calculate similarity between contractor and job"""
        if len(job_features) == 0:
            return []
            
        # Reshape for cosine similarity (contractor is 1 sample, jobs are N samples)
        contractor_features = contractor_features.reshape(1, -1)
        
        # Scale features
        try:
            contractor_scaled = self.scaler.transform(contractor_features)
            jobs_scaled = self.scaler.transform(job_features)
        except:
            # Fallback if scaling fails (e.g. data mismatch or uninitialized scaler)
            contractor_scaled = contractor_features
            jobs_scaled = job_features
        
        # Calculate cosine similarity
        similarities = cosine_similarity(contractor_scaled, jobs_scaled)[0]
        
        return similarities
    
    def train_sample_data(self):
        """Train with sample data (for initial setup)"""
        # Sample data
        np.random.seed(42)
        
        # Generate synthetic training data
        n_samples = 1000
        
        # Contractor features
        contractor_ratings = np.random.uniform(3.0, 5.0, n_samples)
        success_rates = np.random.uniform(0.3, 0.95, n_samples)
        experience_years = np.random.randint(1, 20, n_samples)
        skill_counts = np.random.randint(3, 15, n_samples)
        avg_bids = np.random.randint(20000, 200000, n_samples)
        
        # Job features
        job_budgets = np.random.randint(10000, 500000, n_samples)
        required_skills = np.random.randint(2, 10, n_samples)
        same_city = np.random.randint(0, 2, n_samples)
        urgency_scores = np.random.uniform(0.1, 1.0, n_samples)
        deadline_days = np.random.randint(1, 30, n_samples)
        
        # Labels (1 = good match, 0 = bad match)
        # Simple heuristic for training
        labels = (
            (contractor_ratings > 4.0) &
            (success_rates > 0.7) &
            (experience_years > 3) &
            (same_city == 1) &
            (deadline_days > 7)
        ).astype(int)
        
        # Prepare features
        X = np.column_stack([
            contractor_ratings, success_rates, experience_years, skill_counts, avg_bids/10000,
            job_budgets/10000, required_skills, same_city, urgency_scores, deadline_days/30
        ])
        
        y = labels
        
        # Train model
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        self.model.fit(X_scaled, y)
        
        print(f"Model trained with accuracy: {self.model.score(X_scaled, y):.2f}")
    
    def recommend(self, contractor_profile, job_history, available_jobs, top_n=10):
        """Generate job recommendations"""
        if not available_jobs:
            return []
            
        # Preprocess data
        contractor_features, job_features = self.preprocess_data(
            contractor_profile,
            available_jobs
        )
        
        # Create full feature matrix
        full_features = []
        for job_feat in job_features:
            combined = np.concatenate([contractor_features, job_feat])
            full_features.append(combined)
        
        full_features = np.array(full_features)
        
        # Scale features
        # full_features_scaled = self.scaler.transform(full_features) # Use if scaler was fit on full combined features, but here scaler is on X which is contractor+job params.
        # Wait, in train_sample_data, X is col stack of contractor and job features. So scaler.transform(full_features) works.
        try:
             full_features_scaled = self.scaler.transform(full_features)
             # Predict probabilities
             probabilities = self.model.predict_proba(full_features_scaled)[:, 1]
        except:
             probabilities = np.zeros(len(available_jobs))
        
        # Calculate similarity scores
        similarities = self.calculate_similarity(contractor_features, job_features)
        
        # Combined score (ML probability + similarity)
        combined_scores = 0.7 * probabilities + 0.3 * similarities
        
        # Get top N recommendations
        top_indices = np.argsort(combined_scores)[::-1][:top_n]
        
        recommendations = []
        for idx in top_indices:
            job = available_jobs[idx]
            recommendations.append({
                'job_id': job.get('_id', f'job_{idx}'),
                'score': round(combined_scores[idx] * 100, 2),
                'ml_probability': round(probabilities[idx] * 100, 2),
                'similarity_score': round(similarities[idx] * 100, 2),
                'reason': self._generate_reason(combined_scores[idx], job, contractor_profile)
            })
        
        return recommendations
    
    def _generate_reason(self, score, job, contractor):
        """Generate human-readable reason for recommendation"""
        reasons = []
        
        if score > 0.8:
            reasons.append("Excellent match based on your profile")
        elif score > 0.6:
            reasons.append("Good match for your skills")
        else:
            reasons.append("Potential opportunity")
        
        # Add specific reasons
        if job.get('budget', 0) > contractor.get('avgBidAmount', 0) * 1.5:
            reasons.append("Higher than average budget")
        
        if len(set(job.get('skillsRequired', [])).intersection(contractor.get('skills', []))) > 0:
            reasons.append("Matches your skills")
        
        if job.get('location', {}).get('city') == contractor.get('location', {}).get('city'):
            reasons.append("Local job opportunity")
        
        return ", ".join(reasons)
    
    def save_model(self, path):
        """Save trained model"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler,
            'encoders': self.label_encoders
        }, path)
    
    def load_model(self, path):
        """Load trained model"""
        data = joblib.load(path)
        self.model = data['model']
        self.scaler = data['scaler']
        self.label_encoders = data.get('encoders', {})
