import joblib
import tensorflow as tf
import numpy as np

class HousePricePredictor:
    """
    A modular class for loading the trained ANN model and scaler to make predictions.
    Suitable for integration into Streamlit, Flask, or FastAPI applications.
    """
    def __init__(self, model_path='models/ann_model.keras', scaler_path='models/scaler.pkl'):
        try:
            self.model = tf.keras.models.load_model(model_path)
            self.scaler = joblib.load(scaler_path)
        except Exception as e:
            raise RuntimeError(f"Error loading model or scaler: {e}\nPlease run train.py first.")
        
    def predict(self, features):
        """
        Predicts house price based on input features.
        
        Args:
            features (list or np.array): [Area, Bedrooms, Bathrooms, Age, Location_Suburban, Location_Urban]
            
        Returns:
            float: Predicted house price in dollars.
        """
        # Reshape for single prediction: (1, num_features)
        features_array = np.array(features).reshape(1, -1)
        
        # Apply the same scaling used during training
        scaled_features = self.scaler.transform(features_array)
        
        # Make prediction
        prediction = self.model.predict(scaled_features, verbose=0)
        
        # Return scalar value
        return float(prediction[0][0])

if __name__ == "__main__":
    # Quick test if run directly
    print("Testing Predictor Module...")
    try:
        predictor = HousePricePredictor()
        # Example: 2500 sqft, 4 beds, 3 baths, 5 years old, Suburban (1, 0)
        sample = [2500, 4, 3, 5, 1, 0] 
        price = predictor.predict(sample)
        print(f"Predicted Price for features {sample}: ${price:,.2f}")
    except Exception as e:
        print(e)
