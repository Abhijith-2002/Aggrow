from flask import Blueprint, request, jsonify
import joblib
import os
import numpy as np
from example import recommend_organic_fertilizer
import pandas as pd

fertilizer_bp = Blueprint("fertilizer", __name__)

# Load Inorganic Fertilizer Model
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
MODEL_PATH = os.path.join(BASE_DIR, "models", "fertilizer_model.pkl")
ml_model = joblib.load(MODEL_PATH)


@fertilizer_bp.route("/predict", methods=["POST"])
def predict_fertilizer():
    try:
        # print("🔹 API /predict Called!")
        data = request.get_json()
        crop_name = data["crop_type"]
        # print("Received Data:", data)

        # Convert Inputs to Numeric Values
        for key in [
            "temperature",
            "humidity",
            "moisture",
            "nitrogen",
            "phosphorous",
            "potassium",
            "ph",
        ]:
            if key in data and data[key] != "":
                data[key] = float(data[key])

        # Handle Missing Soil Type
        data["soil_type"] = float(data["soil_type"]) if data["soil_type"] else 0

        # Convert Crop Type to Numeric ID
        CROP_TYPE_MAPPING = {
            "Rice": 0,
            "Wheat": 1,
            "Maize": 2,
            "Cotton": 3,
            "Sugarcane": 4,
        }
        FERTILIZER_MAPPING = {
            0: "Urea",
            1: "DAP",
            2: "MOP",
            3: "NPK",
            4: "Super Phosphate",
            5: "Ammonium Sulphate",
            6: "Magnesium Sulphate",
            7: "Calcium Nitrate",
            8: "Zinc Sulphate",
            9: "Potash",
        }
        if data["crop_type"] in CROP_TYPE_MAPPING:
            data["crop_type"] = CROP_TYPE_MAPPING[data["crop_type"]]
        else:
            return jsonify({"error": f"Invalid crop type: {data['crop_type']}"}), 400

        # Prepare Features
        feature_order = [
            "Temparature",
            "Humidity",
            "Moisture",
            "Soil_Type",
            "Crop_Type",
            "Nitrogen",
            "Potassium",
            "Phosphorous",
            "NPK_Ratio",
        ]

        formatted_data = {
            "Temparature": data["temperature"],
            "Humidity": data["humidity"],
            "Moisture": data["moisture"],
            "Soil_Type": data["soil_type"],
            "Crop_Type": data["crop_type"],
            "Nitrogen": data["nitrogen"],
            "Potassium": data["potassium"],
            "Phosphorous": data["phosphorous"],
            "NPK_Ratio": (data["nitrogen"] + data["phosphorous"] + data["potassium"])
            / 3,
        }

        # Convert to DataFrame
        features_df = pd.DataFrame(
            [[formatted_data[col] for col in feature_order]], columns=feature_order
        )
        # print("✅ Fixed Feature DataFrame:\n", features_df)

        # **Make Prediction**
        prediction = ml_model.predict(features_df)
        # print("✅ Model Prediction (Number):", prediction[0])  # Debugging log

        # **Convert Prediction to Fertilizer Name**
        predicted_fertilizer = FERTILIZER_MAPPING.get(
            int(prediction[0]), "Unknown Fertilizer"
        )
        # print("✅ Mapped Fertilizer Name:", predicted_fertilizer)  # Debugging log

        # **Generate Organic Fertilizer Recommendation**
        organic_fertilizer = recommend_organic_fertilizer(
            data["nitrogen"],
            data["phosphorous"],
            data["potassium"],
            data.get("ph"),
            crop_name,
        )
        # print("✅ Organic Fertilizer Recommendation:", organic_fertilizer)  # Debugging log
        return jsonify(
            {
                "inorganic_fertilizer": predicted_fertilizer,  # Return fertilizer name instead of number
                "organic_fertilizer": organic_fertilizer,
            }
        )

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500


@fertilizer_bp.route("/autofill", methods=["GET"])
def autofill_data():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    # Simulate fetching soil and NPK data from a database based on location
    autofill_data = {
        "temperature": 30.5,
        "humidity": 65.2,
        "moisture": 50.1,
        "soil_type": "Loamy",
        "nitrogen": 45,
        "phosphorous": 30,
        "potassium": 20,
        "ph": 6.5,
    }

    return jsonify(autofill_data)
