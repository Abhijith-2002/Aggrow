from flask import Blueprint, request, jsonify
import os
import pandas as pd
import requests
from utils.recommend import (
    recommend_organic_fertilizer,
)  # Import organic fertilizer logic
import json


fertilizer_bp = Blueprint("fertilizer", __name__)

# API URL & Headers
SOIL_API_URL = "https://soilhealth4.dac.gov.in/"
HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/json",
    "Accept": "application/json",
}

# Load predefined NPK & pH ranges from Fertilizer.csv
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(BASE_DIR, "Data", "Fertilizer.csv")

fertilizer_data = pd.read_csv(CSV_PATH)
nitrogen_range = {
    "low": fertilizer_data["N"].quantile(0.33),
    "medium": fertilizer_data["N"].quantile(0.66),
    "high": fertilizer_data["N"].max(),
}
phosphorous_range = {
    "low": fertilizer_data["P"].quantile(0.33),
    "medium": fertilizer_data["P"].quantile(0.66),
    "high": fertilizer_data["P"].max(),
}
potassium_range = {
    "low": fertilizer_data["K"].quantile(0.33),
    "medium": fertilizer_data["K"].quantile(0.66),
    "high": fertilizer_data["K"].max(),
}
ph_values = {
    "acidic": 5.5,
    "neutral": 6.5,
    "alkaline": 7.5,
}


def get_state_from_coords(lat, lon):
    """Fetch state and district from coordinates using OpenStreetMap API."""
    try:
        url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}"
        response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=10)
        if response.status_code != 200:
            return None
        data = response.json()
        return {
            "state": data.get("address", {}).get("state", "Unknown State"),
            "district": data.get("address", {}).get(
                "state_district", "Unknown District"
            ),
        }
    except Exception:
        return None


def get_state_id(state_name):
    """Fetch state ID from soil API."""
    payload = {"query": "query { getNutrientDashboardForPortal }"}
    try:
        response = requests.post(SOIL_API_URL, json=payload, headers=HEADERS)
        data = response.json()
        for state in data["data"]["getNutrientDashboardForPortal"]:
            if state["state"]["name"].lower() == state_name.lower():
                return state["state"]["_id"]
    except Exception:
        return None


def get_district_soil_details(state_id, district_name):
    """Fetch soil details for a specific district."""
    payload = {
        "query": f'query {{ getNutrientDashboardForPortal(state:"{state_id}") }}'
    }
    try:
        response = requests.post(SOIL_API_URL, json=payload, headers=HEADERS)
        data = response.json().get("data", {}).get("getNutrientDashboardForPortal", [])
        for entry in data:
            if (
                entry["district"]["name"].strip().lower()
                == district_name.strip().lower()
            ):
                return entry["results"]
    except Exception:
        return None
    return None


@fertilizer_bp.route("/autofill", methods=["GET"])
def autofill_data():
    lat, lon = request.args.get("lat"), request.args.get("lon")
    if not lat or not lon:
        return jsonify({"error": "Latitude and longitude are required"}), 400
    location = get_state_from_coords(lat, lon)
    if not location:
        return jsonify({"error": "Failed to determine state"}), 500

    state, district = location["state"], location["district"]
    state_id = get_state_id(state)
    if not state_id:
        return jsonify({"error": "State not found in soil database"}), 404

    soil_data = get_district_soil_details(state_id, district)
    if not soil_data:
        return jsonify({"error": "Soil data not available"}), 404

    # Determine dominant NPK & pH levels
    n_dominant = max(soil_data["n"], key=soil_data["n"].get)
    p_dominant = max(soil_data["p"], key=soil_data["p"].get)
    k_dominant = max(soil_data["k"], key=soil_data["k"].get)
    pH_dominant = max(soil_data["pH"], key=soil_data["pH"].get)

    autofill_data = {
        "nitrogen": float(nitrogen_range[n_dominant.lower()]),
        "phosphorous": float(phosphorous_range[p_dominant.lower()]),
        "potassium": float(potassium_range[k_dominant.lower()]),
        "ph": float(ph_values[pH_dominant.lower()]),
    }
    return json.loads(json.dumps(autofill_data, default=int))


@fertilizer_bp.route("/recommend", methods=["POST"])
def predict_fertilizer():
    try:
        data = request.get_json()
        crop_name = data["crop_type"]
        organic_fertilizer = recommend_organic_fertilizer(
            data["nitrogen"],
            data["phosphorous"],
            data["potassium"],
            data.get("ph"),
            crop_name,
        )
        return jsonify({"organic_fertilizer": organic_fertilizer})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
