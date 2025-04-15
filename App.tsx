# Real-Time Bitcoin Market Data Viewer with Feature Display (Compact Output)

import pandas as pd
import numpy as np
import requests
import time
import joblib
import warnings
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBRegressor, plot_importance
import sys

warnings.filterwarnings('ignore')

# --- Step 1: Load and preprocess your dataset ---
df = pd.read_csv("/content/bitcoin_market_data.csv", parse_dates=["Date"])
df.dropna(inplace=True)

X = df.drop(columns=["Date", "Bitcoin_Price"])
y = df["Bitcoin_Price"]

# --- Step 2: Scale the features ---
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Save the scaler for real-time data
joblib.dump(scaler, "scaler.pkl")

# --- Step 3: Train the XGBoost Model ---
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, shuffle=False, test_size=0.2)
model = XGBRegressor()
model.fit(X_train, y_train)

# Save the model for reuse
joblib.dump(model, "bitcoin_model.pkl")

# --- Step 4: Plot feature importance ---
plt.figure(figsize=(10, 6))
plot_importance(model)
plt.title("Feature Importance")
plt.tight_layout()
plt.savefig("feature_importance.png")

# --- Step 5: Define function to fetch live data (Mocked for now) ---
def fetch_live_data():
    try:
        response = requests.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        price_data = response.json()["bitcoin"]["usd"]

        # Simulated live features (replace with actual APIs in production)
        live_features = {
            "Market_Sentiment": np.random.uniform(-1, 1),
            "Trading_Volume": np.random.randint(100, 1000),
            "Inflation_Rate": 3.2,
            "Interest_Rate": 2.5,
            "Regulatory_Events": 0,
            "Mining_Difficulty": 18.5,
            "Halving_Impact": 0,
            "Institutional_Activity": 0.3,
            "USD_Index": 103.5,
            "Gold_Prices": 1925.4,
            "Whale_Transactions": 0,
            "Geopolitical_Events": 1
        }

        features_df = pd.DataFrame([live_features])
        return features_df, price_data
    except Exception as e:
        print("Error fetching live data:", e)
        return None, None

# --- Step 6: Real-time market viewer loop ---
print("\n[Real-Time Bitcoin Market Viewer Started]\n")

while True:
    features_df, actual_price = fetch_live_data()
    if features_df is not None:
        output = f"Bitcoin Price: ${actual_price} | Factors: "
        output += " | ".join([f"{k}: {v:.2f}" for k, v in features_df.iloc[0].items()])
        sys.stdout.write("\r" + output)
        sys.stdout.flush()
    else:
        print("\rFailed to fetch real-time data.", end="")
    time.sleep(10)
