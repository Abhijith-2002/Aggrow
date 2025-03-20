import pandas as pd
import os

import random
from Data.fertilizer_dict import fertilizer_strategy

# Load Fertilizer Dataset for Crop-Specific NPK Ranges
# Construct the absolute path to the CSV file
# Get absolute path of the backend directory
BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..")
)  # Moves up from utils/
CSV_PATH = os.path.join(BASE_DIR, "backend/Data", "Fertilizer.csv")
# Load Fertilizer Dataset
df_fertilizer = pd.read_csv(CSV_PATH)


def get_crop_npk_thresholds(crop):
    crop_data = df_fertilizer[df_fertilizer["Crop"] == crop]
    if crop_data.empty:
        return None
    return {
        "N_min": crop_data["N"].values[0] - 10,
        "N_max": crop_data["N"].values[0] + 10,
        "P_min": crop_data["P"].values[0] - 10,
        "P_max": crop_data["P"].values[0] + 10,
        "K_min": crop_data["K"].values[0] - 10,
        "K_max": crop_data["K"].values[0] + 10,
        "pH_min": crop_data["pH"].values[0] - 0.5,
        "pH_max": crop_data["pH"].values[0] + 0.5,
    }


# Function to Recommend Organic Fertilizer


def recommend_organic_fertilizer(nitrogen, phosphorus, potassium, pH, crop):
    crop_thresholds = get_crop_npk_thresholds(crop)
    if not crop_thresholds:
        return "Crop data not found. Please ensure the crop name is correct."

    recommendations = []

    if nitrogen < crop_thresholds["N_min"]:
        recommendations.append(
            f"Nitrogen content is LOW:\n"
            + "\n".join(random.sample(fertilizer_strategy["N"]["low"], 4))
        )
    elif nitrogen > crop_thresholds["N_max"]:
        recommendations.append(
            f"Nitrogen content is HIGH:\n"
            + "\n".join(random.sample(fertilizer_strategy["N"]["high"], 4))
        )

    if phosphorus < crop_thresholds["P_min"]:
        recommendations.append(
            f"Phosphorus content is LOW:\n"
            + "\n".join(random.sample(fertilizer_strategy["P"]["low"], 4))
        )
    elif phosphorus > crop_thresholds["P_max"]:
        recommendations.append(
            f"Phosphorus content is HIGH:\n"
            + "\n".join(random.sample(fertilizer_strategy["P"]["high"], 4))
        )

    if potassium < crop_thresholds["K_min"]:
        recommendations.append(
            f"Potassium content is LOW:\n"
            + "\n".join(random.sample(fertilizer_strategy["K"]["low"], 4))
        )
    elif potassium > crop_thresholds["K_max"]:
        recommendations.append(
            f"Potassium content is HIGH:\n"
            + "\n".join(random.sample(fertilizer_strategy["K"]["high"], 4))
        )

    if pH < crop_thresholds["pH_min"]:
        recommendations.append(
            f"Soil pH is LOW:\n"
            + "\n".join(random.sample(fertilizer_strategy["pH"]["low"], 4))
        )
    elif pH > crop_thresholds["pH_max"]:
        recommendations.append(
            f"Soil pH is HIGH:\n"
            + "\n".join(random.sample(fertilizer_strategy["pH"]["high"], 4))
        )

    return (
        "\n\n".join(recommendations)
        if recommendations
        else "No organic fertilizer needed. Soil is well-balanced."
    )


# # Example usage:
# npk_values = {
#     "nitrogen": 90,
#     "phosphorus": 25,
#     "potassium": 20,
#     "pH": 5.5,
#     "crop": "Rice",
# }
# print(recommend_organic_fertilizer(**npk_values))
