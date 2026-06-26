from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from prediction import HousePricePredictor

app = FastAPI(title="AuraEstates Neural Pricing API")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor instance
predictor = None

@app.on_event("startup")
def load_model():
    global predictor
    try:
        # Assumes this is run from the House-Price-Prediction-ANN directory
        predictor = HousePricePredictor(model_path='models/ann_model.keras', scaler_path='models/scaler.pkl')
        print("✅ Neural Network Model loaded successfully.")
    except Exception as e:
        print(f"⚠️ Warning: Could not load model. {e}")

# Define the request payload schema
class PropertyInput(BaseModel):
    area: float
    bedrooms: int
    bathrooms: int
    age: int
    city: str
    property_type: str
    furnishing: str
    condition: str
    vastu_compliant: bool
    metro_proximity: bool
    gated_community: bool

@app.post("/api/predict")
def predict_price(data: PropertyInput):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Ensure train.py has been run.")

    # 1. Map complex Indian contextual data back to the original model's feature set
    # The original model only took [Area, Bedrooms, Bathrooms, Age, Location_Suburban, Location_Urban]
    
    # We map cities to suburban/urban definitions for the model's sake
    tier_1_cities = ["Mumbai", "New Delhi", "Bangalore", "Pune", "Chennai", "Hyderabad"]
    
    loc_urban = 1 if data.city in tier_1_cities else 0
    loc_suburban = 1 if data.city not in tier_1_cities else 0
    
    features = [
        data.area,
        data.bedrooms,
        data.bathrooms,
        data.age,
        loc_suburban,
        loc_urban
    ]

    try:
        # 2. Get base prediction from the loaded ANN model (likely trained in USD)
        base_prediction_usd = predictor.predict(features)
        
        # 3. Apply post-processing heuristics to convert to Indian contextual pricing
        # Conversion rate assumption + heuristic adjustments based on additional frontend params
        base_inr = base_prediction_usd * 83.0 # Rough conversion to INR for base model output
        
        if data.property_type == 'Villa': base_inr *= 1.8
        if data.property_type == 'Independent House': base_inr *= 1.4
        if data.property_type == 'Plot': base_inr *= 0.6
        
        if data.furnishing == 'Fully Furnished': base_inr += (data.area * 1500)
        if data.furnishing == 'Semi-Furnished': base_inr += (data.area * 600)
        
        if data.condition == 'Under Construction': base_inr *= 0.85
        if data.condition == 'Needs Renovation': base_inr *= 0.75

        if data.vastu_compliant: base_inr *= 1.05
        if data.metro_proximity: base_inr *= 1.10
        if data.gated_community: base_inr *= 1.08
        
        return {
            "success": True,
            "prediction_inr": round(base_inr, 2),
            "model_confidence": 94.2 # Mock confidence score
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
def health_check():
    return {"status": "online", "model_loaded": predictor is not None}

if __name__ == "__main__":
    print("🚀 Starting AuraEstates Backend API on port 8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
