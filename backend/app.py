from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import os
import torch
from torchvision import transforms
from PIL import Image
import io
from utils.model import ResNet9
from routes.fertilizer import fertilizer_bp

# --- Gemini API Integration ---
import google.generativeai as genai

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Disease classes list
disease_classes = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
]  # (your list stays unchanged)

app = Flask(__name__, static_folder="static", static_url_path="/")
CORS(app)
app.register_blueprint(fertilizer_bp, url_prefix="/fertilizer")

# Load models
with open("models/cropRecommendationModel/CropRecommendation.pkl", "rb") as file:
    crop_recommendation_model = pickle.load(file)

disease_model = ResNet9(3, len(disease_classes))
disease_model.load_state_dict(
    torch.load("models/plant_disease_model.pth", map_location=torch.device("cpu"))
)
disease_model.eval()


# --- React routes ---
@app.route("/")
@app.route("/dashboard")
@app.route("/crop-recommendation")
@app.route("/fertilizer-recommendation")
@app.route("/disease-detection")
def serve_react():
    return send_from_directory(app.static_folder, "index.html")


"""
# Load the model
model_path = os.path.join(
    os.path.dirname(__file__), "models/cropRecommendationModel/CropRecommendation.pkl"
)
with open(model_path, "rb") as file:
    model = pickle.load(file)

"""


# --- Crop Recommendation API ---
@app.route("/api/crop-recommendation", methods=["POST"])
def predict_crop():
    try:
        data = request.get_json()
        features = [
            float(data["nitrogen"]),
            float(data["phosphorous"]),
            float(data["pottasium"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"]),
        ]
        prediction = crop_recommendation_model.predict([features])
        return jsonify({"success": True, "recommendedCrop": prediction[0]})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --- Disease Detection API ---
@app.route("/api/disease-detection", methods=["POST"])
def detect_disease():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "error": "No selected file"}), 400

        image = Image.open(io.BytesIO(file.read())).convert("RGB")
        transform = transforms.Compose(
            [
                transforms.Resize(256),
                transforms.ToTensor(),
            ]
        )
        img_tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = disease_model(img_tensor)
            _, predicted = torch.max(output, 1)
            prediction = disease_classes[predicted.item()]
            confidence = float(
                torch.max(torch.nn.functional.softmax(output, dim=1)) * 100
            )

        # Gemini content generation with error handling
        try:
            prompt = f"Suggest both organic and chemical treatments for the following plant disease in a short and concise manner: {prediction.replace('_', ' ')}."
            model = genai.GenerativeModel("gemini-2.0-flash")
            gemini_response = model.generate_content(prompt)
            cures = gemini_response.text.strip()
        except Exception as gemini_error:
            cures = f"Unable to generate treatment suggestions: {str(gemini_error)}"

        return jsonify(
            {
                "success": True,
                "prediction": prediction,
                "confidence": round(confidence, 2),
                "cures": cures,
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
