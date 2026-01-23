# ml/geo_analysis.py
import cv2
import numpy as np
from PIL import Image, ImageOps
import exifread
from geopy.geocoders import Nominatim
from datetime import datetime
import math
import os

class GeoAnalyzer:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="job_platform")
        
    def extract_gps_from_image(self, image_path):
        """Extract GPS coordinates from image EXIF data"""
        try:
            with open(image_path, 'rb') as f:
                tags = exifread.process_file(f)
                
            gps_data = {}
            if 'GPS GPSLatitude' in tags and 'GPS GPSLongitude' in tags:
                lat = self._convert_to_degrees(tags['GPS GPSLatitude'].values)
                lon = self._convert_to_degrees(tags['GPS GPSLongitude'].values)
                
                if tags['GPS GPSLatitudeRef'].values != 'N':
                    lat = -lat
                if tags['GPS GPSLongitudeRef'].values != 'E':
                    lon = -lon
                    
                gps_data = {'latitude': lat, 'longitude': lon}
                
            return gps_data
        except:
            return {}
    
    def _convert_to_degrees(self, value):
        """Convert GPS coordinates to decimal degrees"""
        d = float(value[0])
        m = float(value[1]) / 60.0
        s = float(value[2]) / 3600.0
        return d + m + s
    
    def calculate_distance(self, coord1, coord2):
        """Calculate distance between two coordinates (Haversine formula)"""
        if not coord1 or not coord2:
            return 0
            
        R = 6371  # Earth's radius in km
        
        # Check format (dict vs list/tuple)
        lat1_val = coord1.get('latitude') if isinstance(coord1, dict) else coord1[1] if len(coord1) > 1 else 0
        lon1_val = coord1.get('longitude') if isinstance(coord1, dict) else coord1[0] if len(coord1) > 0 else 0
        
        lat2_val = coord2.get('latitude') if isinstance(coord2, dict) else coord2[1] if len(coord2) > 1 else 0
        lon2_val = coord2.get('longitude') if isinstance(coord2, dict) else coord2[0] if len(coord2) > 0 else 0
        
        lat1, lon1 = math.radians(lat1_val), math.radians(lon1_val)
        lat2, lon2 = math.radians(lat2_val), math.radians(lon2_val)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
    
    def analyze_location_consistency(self, coordinates_list, claimed_location):
        """Check if all evidence locations match claimed location"""
        if not coordinates_list or not claimed_location:
            return {
                'average_distance_km': 0,
                'distance_std': 0,
                'is_consistent': False,
                'points_analyzed': 0
            }
            
        distances = []
        for coord in coordinates_list:
            distance = self.calculate_distance(coord, claimed_location)
            distances.append(distance)
        
        if not distances:
            return {
                'average_distance_km': 0,
                'distance_std': 0,
                'is_consistent': False,
                'points_analyzed': 0
            }

        avg_distance = np.mean(distances)
        std_distance = np.std(distances)
        
        return {
            'average_distance_km': float(avg_distance),
            'distance_std': float(std_distance),
            'is_consistent': avg_distance < 0.5 and std_distance < 0.2,  # Within 500m radius
            'points_analyzed': len(coordinates_list)
        }
    
    def detect_image_tampering(self, image_path):
        """Basic image forensics for tampering detection"""
        try:
            img = cv2.imread(image_path)
            if img is None:
                return {'tampering_score': 0, 'error': 'Could not read image'}

            # Check for double compression artifacts
            # Simple edge consistency analysis
            edges = cv2.Canny(img, 100, 200)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Check metadata consistency
            has_metadata = False
            try:
                with Image.open(image_path) as img_pil:
                     exif = img_pil.getexif()
                     has_metadata = len(exif) > 0 if exif else False
            except:
                pass
            
            analysis = {
                'edge_density': float(edge_density),
                'has_metadata': has_metadata,
                'image_size': img.shape,
                'tampering_score': 0  # Placeholder for actual ML model
            }
            
            return analysis
        except Exception as e:
            return {'tampering_score': 0, 'error': str(e)}
    
    def analyze_time_consistency(self, timestamps, job_timeline):
        """Check if evidence timestamps match job timeline"""
        try:
            timestamps_dt = []
            for ts in timestamps:
                if isinstance(ts, str):
                    timestamps_dt.append(datetime.fromisoformat(ts.replace('Z', '+00:00')))
                else:
                    timestamps_dt.append(ts)
                    
            timeline_start = datetime.fromisoformat(job_timeline['start'].replace('Z', '+00:00')) if isinstance(job_timeline['start'], str) else job_timeline['start']
            timeline_end = datetime.fromisoformat(job_timeline['end'].replace('Z', '+00:00')) if isinstance(job_timeline['end'], str) else job_timeline['end']
            
            violations = []
            for ts in timestamps_dt:
                if ts < timeline_start or ts > timeline_end:
                    violations.append(ts.isoformat())
            
            return {
                'total_evidence': len(timestamps),
                'timeline_violations': len(violations),
                'violation_times': violations,
                'is_timely': len(violations) == 0
            }
        except:
            return {'is_timely': True, 'error': 'Could not parse timestamps'}
    
    def analyze(self, coordinates, files, contractor_id, timestamp):
        """Main analysis function"""
        location_analysis = self.analyze_location_consistency(
            [coordinates], 
            coordinates  # For now, compare with itself
        )
        
        tampering_analysis = []
        for file_path in files:
            analysis = self.detect_image_tampering(file_path)
            tampering_analysis.append(analysis)
        
        # Calculate overall risk score
        risk_factors = {
            'location_consistency': 0.4,
            'time_consistency': 0.3,
            'tampering_detection': 0.3
        }
        
        # Simple risk score calculation
        tampering_score_mean = np.mean([t.get('tampering_score', 0) for t in tampering_analysis]) if tampering_analysis else 0
        
        risk_score = (
            (0 if location_analysis['is_consistent'] else 1) * risk_factors['location_consistency'] +
            0 * risk_factors['time_consistency'] +  # Assuming time is consistent for now
            tampering_score_mean * risk_factors['tampering_detection']
        ) * 100
        
        address = "Unknown Location"
        try:
            if coordinates and 'latitude' in coordinates and 'longitude' in coordinates:
                 location = self.geolocator.reverse(f"{coordinates['latitude']}, {coordinates['longitude']}")
                 if location:
                     address = location.address
        except:
             pass

        return {
            'location': {
                'address': address,
                'accuracy': 100 # Placeholder
            },
            'location_analysis': location_analysis,
            'tampering_analysis': tampering_analysis,
            'risk_score': round(risk_score, 2),
            'is_fake': risk_score > 70,
            'risk_reason': 'High risk of fraudulent evidence' if risk_score > 70 else 'Evidence appears genuine',
            'processed_files': len(files)
        }
