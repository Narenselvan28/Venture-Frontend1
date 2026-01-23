# ml_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import json
import sys
import os

# Add ML modules to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'ml'))

from geo_analysis import GeoAnalyzer
from fake_job_detector import FakeJobDetector
from recommendation_engine import JobRecommender

app = Flask(__name__)
CORS(app)

# Initialize ML models
geo_analyzer = GeoAnalyzer()
fake_job_detector = FakeJobDetector()
job_recommender = JobRecommender()

# Load models
try:
    job_recommender.load_model('models/gradient_boost_model.pkl')
    print("ML Models loaded successfully")
except:
    print("Training models...")
    # Train models if not exists
    try:
        if not os.path.exists('models'):
            os.makedirs('models')
        job_recommender.train_sample_data()
        job_recommender.save_model('models/gradient_boost_model.pkl')
    except Exception as e:
        print(f"Error training models: {e}")

# Geo-analysis endpoint
@app.route('/api/ml/geo-analyze', methods=['POST'])
def geo_analyze():
    try:
        data = request.json
        
        # Extract coordinates and metadata
        coordinates = data.get('coordinates', {})
        files = data.get('files', [])
        contractor_id = data.get('contractorId')
        timestamp = data.get('timestamp')
        
        # Perform geo-analysis
        analysis = geo_analyzer.analyze(
            coordinates=coordinates,
            files=files,
            contractor_id=contractor_id,
            timestamp=timestamp
        )
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Fake job detection endpoint
@app.route('/api/ml/detect-fake', methods=['POST'])
def detect_fake_job():
    try:
        data = request.json
        
        # Extract job data
        job_data = {
            'images': data.get('images', []),
            'description': data.get('description', ''),
            'location': data.get('location', {}),
            'budget': data.get('budget', 0),
            'posted_by': data.get('postedBy', ''),
            'job_id': data.get('jobId', '')
        }
        
        # Detect fake job
        detection = fake_job_detector.detect(job_data)
        
        return jsonify({
            'success': True,
            'detection': detection,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Job recommendation endpoint
@app.route('/api/ml/recommend', methods=['POST'])
def recommend_jobs():
    try:
        data = request.json
        
        contractor_data = data.get('contractor', {})
        job_history = data.get('jobHistory', [])
        available_jobs = data.get('currentJobs', [])
        
        # Get recommendations
        recommendations = job_recommender.recommend(
            contractor_profile=contractor_data,
            job_history=job_history,
            available_jobs=available_jobs,
            top_n=10
        )
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Prediction formula endpoint
@app.route('/api/ml/predict-success', methods=['POST'])
def predict_success():
    try:
        data = request.json
        
        # Prediction formula
        # P(success) = w1*skill_match + w2*price_ratio + w3*deadline_buffer + w4*historical_success
        
        skill_match = data.get('skillMatch', 0)  # 0-1
        price_ratio = min(data.get('priceRatio', 1), 1.5)  # bid/budget
        deadline_buffer = data.get('deadlineBuffer', 0)  # days
        historical_success = data.get('historicalSuccess', 0.5)  # 0-1
        
        # Weights (trained from historical data)
        weights = {
            'skill_match': 0.35,
            'price_ratio': 0.25,
            'deadline_buffer': 0.20,
            'historical_success': 0.20
        }
        
        # Normalize inputs
        normalized_price = 1 - abs(1 - price_ratio) / 0.5  # Best at 1.0
        normalized_deadline = min(deadline_buffer / 7, 1)  # 7 days buffer is optimal
        
        # Calculate success probability
        success_probability = (
            weights['skill_match'] * skill_match +
            weights['price_ratio'] * normalized_price +
            weights['deadline_buffer'] * normalized_deadline +
            weights['historical_success'] * historical_success
        ) * 100
        
        return jsonify({
            'success': True,
            'prediction': {
                'success_probability': round(success_probability, 2),
                'factors': {
                    'skill_match': skill_match * 100,
                    'price_competitiveness': normalized_price * 100,
                    'deadline_buffer': normalized_deadline * 100,
                    'historical_performance': historical_success * 100
                },
                'recommendation': 'recommended' if success_probability > 70 else 'not_recommended'
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'ml_server',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
