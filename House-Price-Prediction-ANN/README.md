# House Price Prediction Using Artificial Neural Network (ANN)

## Objective
The objective of this project is to build an end-to-end Machine Learning solution using an Artificial Neural Network (ANN) to predict house prices based on various structural and locational features. This project serves as a comprehensive demonstration of deep learning for regression tasks, ideal for a B.Tech final-year project.

## Project Architecture
- **Input Layer:** Accepts normalized numerical features (e.g., Area, Bedrooms, Bathrooms, Age).
- **Hidden Layer 1:** 64 Neurons (ReLU Activation)
- **Hidden Layer 2:** 32 Neurons (ReLU Activation)
- **Hidden Layer 3:** 16 Neurons (ReLU Activation)
- **Output Layer:** 1 Neuron (Linear Activation for Regression)

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the Model:**
   Execute the training script to perform EDA, clean data, normalize features, and train the ANN.
   ```bash
   python train.py
   ```
   *This will generate plots in the `plots/` directory and save the trained model in the `models/` directory.*

3. **Run the Web Application:**
   Launch the Streamlit app to interact with the trained model and make predictions.
   ```bash
   streamlit run app.py
   ```

## Repository Structure
- `dataset/`: Contains the housing CSV dataset.
- `notebooks/`: Contains Jupyter Notebooks for step-by-step EDA and experimentation.
- `models/`: Stores the saved `.keras` model and `scaler.pkl`.
- `plots/`: Stores visualizations generated during training.
- `train.py`: Main script for preprocessing, training, and evaluating the ANN.
- `prediction.py`: Helper class for inference.
- `app.py`: Streamlit frontend web application.
