import pandas as pd
import matplotlib.pyplot as plt
import pickle
import numpy as np

from sklearn.model_selection import train_test_split
import sklearn.metrics as metrics
from sklearn.linear_model import LogisticRegression
import seaborn as sns


PATH = 'rainFallData.csv'
data = pd.read_csv(PATH)

print(data.head())