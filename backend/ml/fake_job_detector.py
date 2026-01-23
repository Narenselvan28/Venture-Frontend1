# ml/fake_job_detector.py
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
import re

class FakeJobDetector:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=1000)
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.is_trained = False
        
        # Fake job patterns
        self.suspicious_patterns = [
            r'(?i)work from home.*immediately.*no experience',
            r'(?i)earn.*\$[0-9,]+.*per day',
            r'(?i)investment.*required',
            r'(?i)guaranteed.*income',
            r'(?i)no interview.*required'
        ]
        
    def extract_features(self, job_data):
        """Extract features from job data"""
        features = {}
        
        # Text features
        description = job_data.get('description', '').lower()
        features['description_length'] = len(description)
        features['has_contact_info'] = bool(re.search(r'\b\d{10}\b|\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b', description))
        features['has_url'] = bool(re.search(r'https?://\S+', description))
        
        # Pattern matching
        features['suspicious_patterns_count'] = sum(
            1 for pattern in self.suspicious_patterns 
            if re.search(pattern, description)
        )
        
        # Budget features
        budget = job_data.get('budget', 0)
        avg_budget = 50000  # Average job budget in INR
        features['budget_ratio'] = budget / avg_budget if avg_budget > 0 else 0
        features['budget_suspicious'] = 1 if budget > avg_budget * 5 else 0  # 5x average
        
        # Location features
        location = job_data.get('location', {})
        features['has_coordinates'] = 1 if location.get('latitude') and location.get('longitude') else 0
        
        # Image features (placeholder)
        images = job_data.get('images', [])
        features['has_images'] = 1 if len(images) > 0 else 0
        features['image_count'] = len(images)
        
        return features
    
    def train(self, training_data):
        """Train the model with historical data"""
        X = []
        y = []
        
        for data in training_data:
            features = self.extract_features(data)
            X.append(list(features.values()))
            y.append(data.get('is_fake', 0))
        
        # Convert text descriptions to TF-IDF
        descriptions = [d.get('description', '') for d in training_data]
        if descriptions:
             X_text = self.vectorizer.fit_transform(descriptions).toarray()
             # Combine features
             X_combined = np.hstack([X, X_text])
        else:
             X_combined = np.array(X)
        
        if len(y) > 0:
            # Train model
            self.model.fit(X_combined, y)
            self.is_trained = True
            return self.model.score(X_combined, y)
        return 0
    
    def detect(self, job_data):
        """Detect if job is fake"""
        # Extract features
        features = self.extract_features(job_data)
        
        # Additional rules-based checks
        rules_violations = []
        
        # Rule 1: Too good to be true budget
        if features['budget_suspicious']:
            rules_violations.append('Unusually high budget')
        
        # Rule 2: Suspicious patterns in description
        if features['suspicious_patterns_count'] > 0:
            rules_violations.append(f'Suspicious patterns found ({features["suspicious_patterns_count"]})')
        
        # Rule 3: No location info
        if not features['has_coordinates']:
            rules_violations.append('No location coordinates')
        
        # Rule 4: Too short description
        if features['description_length'] < 50:
            rules_violations.append('Description too short')
            
        probability = 0
        confidence = 0
        
        if self.is_trained:
            try:
                feature_vector = list(features.values())
                
                # Add TF-IDF features
                description = job_data.get('description', '')
                text_features = self.vectorizer.transform([description]).toarray()[0]
                
                # Combine features
                X = np.concatenate([feature_vector, text_features]).reshape(1, -1)
                
                # Predict
                probability = self.model.predict_proba(X)[0][1]
                confidence = round(self.model.predict_proba(X)[0].max(), 4)
            except:
                pass
        
        # Calculate risk score
        risk_score = probability * 100
        
        # Adjust risk based on rules violations
        risk_adjustment = len(rules_violations) * 25
        final_risk_score = min(risk_score + risk_adjustment, 100)
        
        return {
            'is_suspicious': final_risk_score > 70,
            'risk_score': round(final_risk_score, 2),
            'probability': round(probability, 4),
            'rules_violations': rules_violations,
            'reasons': rules_violations if rules_violations else ['No obvious red flags'],
            'confidence': confidence
        }
