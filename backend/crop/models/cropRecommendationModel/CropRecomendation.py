import pandas as pd
import matplotlib.pyplot as plt
import pickle
import numpy as np

from sklearn.model_selection import train_test_split
import sklearn.metrics as metrics
from sklearn.linear_model import LogisticRegression
import seaborn as sns


PATH = 'Crop_recommendation.csv'
data = pd.read_csv(PATH)

features = data[['N','P','K','temperature','humidity','ph','rainfall']]
labels = data['label']

X_train, X_test, Y_train, Y_test = train_test_split(features,labels,test_size=0.2,random_state=42)

LogReg = LogisticRegression(random_state=42).fit(X_train,Y_train)

predicted_values = LogReg.predict(X_test)

accuracy = metrics.accuracy_score(Y_test,predicted_values)

print("Model accuracy: ", accuracy)

filename = 'CropRecommendation.pkl'
MODELS = './recommender-models/'
# Use pickle to save ML model 
pickle.dump(LogReg, open(MODELS + filename, 'wb')) 
