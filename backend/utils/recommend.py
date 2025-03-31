import pandas as pd
import os

# Load Fertilizer Dataset for Crop-Specific NPK Ranges
# Construct the absolute path to the CSV file
# Get absolute path of the backend directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSV_PATH = os.path.join(BASE_DIR, "Data", "Fertilizer.csv")
df_fertilizer = pd.read_csv(CSV_PATH)


def get_crop_npk_thresholds(crop):
    # print("Crop:", crop)
    # print("Crop:", df_fertilizer[crop])
    crop_data = df_fertilizer[df_fertilizer["Crop"] == crop]
    # print(crop_data)
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
        recommendations.append("N_min")
    elif nitrogen > crop_thresholds["N_max"]:
        recommendations.append("N_max")

    if phosphorus < crop_thresholds["P_min"]:
        recommendations.append("P_min")
    elif phosphorus > crop_thresholds["P_max"]:
        recommendations.append("P_max")

    if potassium < crop_thresholds["K_min"]:
        recommendations.append("K_min")
    elif potassium > crop_thresholds["K_max"]:
        recommendations.append("K_max")

    if pH < crop_thresholds["pH_min"]:
        recommendations.append("pH_min")
    elif pH > crop_thresholds["pH_max"]:
        recommendations.append("pH_max")

    print(recommendations)
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
