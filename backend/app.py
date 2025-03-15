from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model
model_path = os.path.join(os.path.dirname(__file__), '/home/abhijith/aggrow/backend/crop/models/cropRecommendationModel/CropRecommendation.pkl')
with open(model_path, 'rb') as file:
    model = pickle.load(file)

@app.route('/api/crop-recommendation', methods=['POST'])
def predict_crop():
    try:
        data = request.get_json()
        
        # Extract features from the request
        features = [
            float(data['nitrogen']),
            float(data['phosphorous']),
            float(data['pottasium']),
            float(data['temperature']),
            float(data['humidity']),
            float(data['ph']),
            float(data['rainfall'])
        ]
        
        # Make prediction
        features_array = np.array([features])
        prediction = model.predict(features_array)
        
        # Return the result
        return jsonify({
            'success': True,
            'recommendedCrop': prediction[0]
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)