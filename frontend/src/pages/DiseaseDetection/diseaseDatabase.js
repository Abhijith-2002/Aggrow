// src/diseaseDatabase.js
const diseaseDatabase = {
  // Apple Diseases
  Apple___Apple_scab: {
    name: "Apple Scab",
    description:
      "Fungal disease causing dark, scaly lesions on leaves and fruit.",
    causes: [
      "Caused by fungus Venturia inaequalis",
      "Spreads in cool, wet weather",
      "Overwinters in fallen leaves",
    ],
    treatments: {
      organic: [
        "Prune trees for better airflow",
        "Apply sulfur spray every 7-10 days in spring",
        "Remove fallen leaves in autumn",
      ],
      chemical: [
        "Myclobutanil (Immunox) during wet periods",
        "Captan fungicide at bud break",
      ],
    },
  },
  Apple___Black_rot: {
    name: "Black Rot",
    description: "Causes rotting fruit with concentric rings and leaf spots.",
    causes: ["Fungus Botryosphaeria obtusa", "Enters through wounds in fruit"],
    treatments: {
      organic: [
        "Remove infected fruit immediately",
        "Copper sprays in early season",
      ],
      chemical: ["Apply fungicides at petal fall"],
    },
  },
  Apple___Cedar_apple_rust: {
    name: "Cedar Apple Rust",
    description: "Orange-yellow spots on leaves with fungal growth underneath.",
    treatments: {
      organic: [
        "Remove nearby juniper/cedar trees if possible",
        "Apply sulfur or copper fungicides",
      ],
      chemical: ["Myclobutanil or triadimefon fungicides"],
    },
  },
  Apple___healthy: {
    name: "Healthy Apple Tree",
    description: "Your apple tree shows no signs of disease!",
    treatments: {
      prevention: [
        "Prune annually to improve air circulation",
        "Apply dormant oil spray in late winter",
        "Maintain proper soil pH (6.0-6.5)",
      ],
    },
  },

  // Blueberry
  Blueberry___healthy: {
    name: "Healthy Blueberry",
    description: "Your blueberry plant is thriving!",
    treatments: {
      care: [
        "Maintain acidic soil (pH 4.5-5.5)",
        "Mulch with pine needles",
        "Prune old canes annually",
      ],
    },
  },

  // Cherry Diseases
  "Cherry_(including_sour)___Powdery_mildew": {
    name: "Cherry Powdery Mildew",
    description: "White powdery coating on leaves and shoots.",
    treatments: {
      organic: [
        "Apply potassium bicarbonate solution",
        "Improve air circulation through pruning",
      ],
      chemical: ["Sulfur or triforine fungicides"],
    },
  },
  "Cherry_(including_sour)___healthy": {
    name: "Healthy Cherry Tree",
    description: "Your cherry tree is in excellent condition!",
    treatments: {
      prevention: [
        "Avoid overhead watering",
        "Apply balanced fertilizer in early spring",
        "Monitor for borers",
      ],
    },
  },

  // Corn Diseases
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
    name: "Corn Gray Leaf Spot",
    description: "Rectangular tan lesions with yellow halos on leaves.",
    treatments: {
      organic: [
        "Rotate crops (avoid continuous corn)",
        "Use resistant varieties",
      ],
      chemical: ["Apply azoxystrobin or pyraclostrobin fungicides"],
    },
  },
  "Corn_(maize)___Common_rust_": {
    name: "Corn Common Rust",
    description: "Small cinnamon-brown pustules on both leaf surfaces.",
    treatments: {
      organic: [
        "Plant early-maturing varieties",
        "Remove crop debris after harvest",
      ],
      chemical: ["Chlorothalonil or mancozeb fungicides"],
    },
  },
  "Corn_(maize)___Northern_Leaf_Blight": {
    name: "Northern Corn Leaf Blight",
    description: "Long, elliptical gray-green lesions that turn tan.",
    treatments: {
      organic: ["Practice crop rotation", "Use disease-free seed"],
      chemical: ["Apply fungicides at first sign"],
    },
  },
  "Corn_(maize)___healthy": {
    name: "Healthy Corn",
    description: "Your corn plants are growing well!",
    treatments: {
      care: [
        "Ensure proper spacing (10-12 inches apart)",
        "Side-dress with nitrogen when plants are knee-high",
        "Water deeply during dry spells",
      ],
    },
  },

  // Grape Diseases
  Grape___Black_rot: {
    name: "Grape Black Rot",
    description: "Brown lesions on leaves with black fruit rot.",
    treatments: {
      organic: ["Remove mummified berries", "Apply copper fungicides"],
      chemical: ["Mancozeb or captan fungicides"],
    },
  },
  "Grape___Esca_(Black_Measles)": {
    name: "Esca (Black Measles)",
    description:
      "Chronic wood disease causing leaf discoloration and berry spots.",
    treatments: {
      management: [
        "Prune infected wood (disinfect tools between cuts)",
        "Avoid excessive pruning",
        "Maintain vine balance",
      ],
    },
  },
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
    name: "Grape Leaf Blight",
    description: "Angular brown spots with yellow halos on leaves.",
    treatments: {
      organic: ["Improve air circulation", "Remove infected leaves"],
      chemical: ["Copper-based fungicides"],
    },
  },
  Grape___healthy: {
    name: "Healthy Grape Vine",
    description: "Your grapevine is disease-free!",
    treatments: {
      care: [
        "Train vines for good air circulation",
        "Monitor for pests like Japanese beetles",
        "Test soil every 3 years",
      ],
    },
  },

  // Citrus
  "Orange___Haunglongbing_(Citrus_greening)": {
    name: "Citrus Greening (HLB)",
    description: "Yellow shoots, lopsided fruit, and bitter juice.",
    treatments: {
      management: [
        "Remove infected trees immediately",
        "Control psyllid vectors with insecticides",
        "Use disease-free nursery stock",
      ],
    },
  },

  // Peach Diseases
  Peach___Bacterial_spot: {
    name: "Peach Bacterial Spot",
    description: "Small dark spots on leaves and fruit that may crack.",
    treatments: {
      organic: ["Plant resistant varieties", "Avoid overhead irrigation"],
      chemical: ["Copper sprays during dormancy"],
    },
  },
  Peach___healthy: {
    name: "Healthy Peach Tree",
    description: "Your peach tree is in great condition!",
    treatments: {
      care: [
        "Prune to open center shape",
        "Thin fruit to 6-8 inches apart",
        "Apply dormant oil spray",
      ],
    },
  },

  // Pepper Diseases
  "Pepper,_bell___Bacterial_spot": {
    name: "Bacterial Leaf Spot",
    description: "Small water-soaked spots that turn brown on leaves.",
    treatments: {
      organic: ["Use pathogen-free seed", "Avoid working with wet plants"],
      chemical: ["Copper-based bactericides"],
    },
  },
  "Pepper,_bell___healthy": {
    name: "Healthy Bell Pepper",
    description: "Your pepper plant is thriving!",
    treatments: {
      care: [
        "Provide consistent moisture",
        "Use balanced fertilizer",
        "Harvest regularly to promote more fruit",
      ],
    },
  },

  // Potato Diseases
  Potato___Early_blight: {
    name: "Early Blight",
    description: "Concentric rings on leaves with yellow halos.",
    treatments: {
      organic: ["Rotate crops (3-year rotation)", "Remove infected foliage"],
      chemical: ["Chlorothalonil or mancozeb fungicides"],
    },
  },
  Potato___Late_blight: {
    name: "Late Blight",
    description: "Water-soaked lesions that rapidly destroy foliage.",
    treatments: {
      organic: [
        "Destroy infected plants immediately",
        "Plant resistant varieties",
      ],
      chemical: ["Apply fungicides preventatively in wet weather"],
    },
  },
  Potato___healthy: {
    name: "Healthy Potato",
    description: "Your potato plants are growing well!",
    treatments: {
      care: [
        "Hill soil around stems as plants grow",
        "Water consistently (1-2 inches per week)",
        "Harvest after vines die back",
      ],
    },
  },

  // Raspberry
  Raspberry___healthy: {
    name: "Healthy Raspberry",
    description: "Your raspberry canes are vigorous!",
    treatments: {
      maintenance: [
        "Prune old canes after fruiting",
        "Mulch to conserve moisture",
        "Provide trellis support",
      ],
    },
  },

  // Soybean
  Soybean___healthy: {
    name: "Healthy Soybean",
    description: "Your soybean crop looks excellent!",
    treatments: {
      care: [
        "Rotate with corn or small grains",
        "Inoculate seeds with rhizobium bacteria",
        "Monitor for aphids",
      ],
    },
  },

  // Squash
  Squash___Powdery_mildew: {
    name: "Powdery Mildew",
    description: "White powdery coating on leaves that yellows and dies.",
    treatments: {
      organic: [
        "Milk spray (1 part milk to 9 parts water)",
        "Baking soda solution (1 tbsp per gallon)",
      ],
      chemical: ["Sulfur or potassium bicarbonate fungicides"],
    },
  },

  // Strawberry Diseases
  Strawberry___Leaf_scorch: {
    name: "Leaf Scorch",
    description: "Purple spots with white centers on older leaves.",
    treatments: {
      organic: ["Remove infected leaves", "Improve air circulation"],
      chemical: ["Captan or thiophanate-methyl fungicides"],
    },
  },
  Strawberry___healthy: {
    name: "Healthy Strawberry",
    description: "Your strawberry plants are producing well!",
    treatments: {
      care: [
        "Renovate beds after harvest",
        "Use straw mulch to keep fruit clean",
        "Replace plants every 3-4 years",
      ],
    },
  },

  // Tomato Diseases
  Tomato___Bacterial_spot: {
    name: "Bacterial Spot",
    description: "Small water-soaked spots that become scabby on fruit.",
    treatments: {
      organic: ["Use disease-free seed", "Avoid overhead watering"],
      chemical: ["Copper sprays early in season"],
    },
  },
  Tomato___Early_blight: {
    name: "Early Blight",
    description: "Target-like rings on lower leaves that spread upward.",
    treatments: {
      organic: ["Remove infected leaves", "Stake plants for better air flow"],
      chemical: ["Chlorothalonil every 7-10 days"],
    },
  },
  Tomato___Late_blight: {
    name: "Late Blight",
    description: "Rapidly spreading water-soaked lesions in cool, wet weather.",
    treatments: {
      organic: [
        "Destroy infected plants immediately",
        "Plant resistant varieties",
      ],
      chemical: ["Apply fungicides preventatively"],
    },
  },
  Tomato___Leaf_Mold: {
    name: "Leaf Mold",
    description: "Yellow spots with olive-green mold underneath leaves.",
    treatments: {
      organic: ["Reduce humidity in greenhouse", "Space plants further apart"],
      chemical: ["Chlorothalonil or copper fungicides"],
    },
  },
  Tomato___Septoria_leaf_spot: {
    name: "Septoria Leaf Spot",
    description: "Small circular spots with dark margins and gray centers.",
    treatments: {
      organic: [
        "Remove lower leaves up to 12 inches",
        "Mulch to prevent soil splash",
      ],
      chemical: ["Mancozeb or copper fungicides"],
    },
  },
  "Tomato___Spider_mites Two-spotted_spider_mite": {
    name: "Spider Mites",
    description:
      "Tiny yellow stippling on leaves with fine webbing underneath.",
    treatments: {
      organic: [
        "Spray with water to dislodge mites",
        "Release predatory mites",
      ],
      chemical: ["Miticide sprays if severe"],
    },
  },
  Tomato___Target_Spot: {
    name: "Target Spot",
    description: "Brown spots with concentric rings and yellow halos.",
    treatments: {
      organic: ["Remove infected plant material", "Improve air circulation"],
      chemical: ["Chlorothalonil fungicides"],
    },
  },
  Tomato___Tomato_Yellow_Leaf_Curl_Virus: {
    name: "Yellow Leaf Curl Virus",
    description: "Upward curling leaves with yellow margins, stunted growth.",
    treatments: {
      management: [
        "Remove infected plants",
        "Control whitefly vectors",
        "Plant resistant varieties",
      ],
    },
  },
  Tomato___Tomato_mosaic_virus: {
    name: "Tomato Mosaic Virus",
    description: "Mottled light and dark green patterns on leaves.",
    treatments: {
      prevention: [
        "Use virus-free seed",
        "Disinfect tools regularly",
        "Control aphid vectors",
      ],
    },
  },
  Tomato___healthy: {
    name: "Healthy Tomato",
    description: "Your tomato plant is thriving!",
    treatments: {
      care: [
        "Prune suckers below first flower cluster",
        "Water consistently (1-2 inches per week)",
        "Mulch to maintain soil moisture",
      ],
    },
  },
};

export function getDiseaseInfo(diseaseClass) {
  return (
    diseaseDatabase[diseaseClass] || {
      name: diseaseClass.replace(/_/g, " "),
      description: "General plant care advice",
      treatments: {
        care: [
          "Remove affected leaves",
          "Improve air circulation",
          "Avoid overhead watering",
        ],
      },
    }
  );
}
