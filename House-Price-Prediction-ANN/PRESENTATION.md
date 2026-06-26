# House Price Prediction Using Artificial Neural Network (ANN)

*Presentation Slides Content*

---

## Slide 1: Title Slide
**House Price Prediction Using Artificial Neural Network (ANN)**
*   **Presented By:** [Your Name/Team]
*   **Course:** B.Tech Final Year Project
*   **Domain:** Machine Learning & Deep Learning

---

## Slide 2: Project Objective
*   **Goal:** Build a complete Machine Learning solution to predict real estate prices based on structural and locational features.
*   **Why?** To help buyers, sellers, and investors make data-driven decisions.
*   **Approach:** End-to-end lifecycle (EDA, Preprocessing, ANN Modeling, Streamlit Web App Deployment).

---

## Slide 3: Dataset Overview
*   **Source:** Real-world housing records.
*   **Features:**
    *   `Area` (Square footage)
    *   `Bedrooms` (Count)
    *   `Bathrooms` (Count)
    *   `Age` (Years)
    *   `Location` (Urban, Suburban, Rural)
*   **Target:** `Price` (in US Dollars)

---

## Slide 4: Data Preprocessing & EDA
*   **Cleaning:** Removed missing values and duplicated records.
*   **Encoding:** Converted categorical `Location` into numerical formats using One-Hot Encoding.
*   **Scaling:** Applied `StandardScaler` to ensure uniform feature contribution.
*   **Visualizations:** Generated Price Distributions and Feature Correlation Matrices.

---

## Slide 5: ANN Architecture
*   **Framework:** TensorFlow & Keras
*   **Input Layer:** 6 Scaled Features
*   **Hidden Layer 1:** 64 Neurons (ReLU)
*   **Hidden Layer 2:** 32 Neurons (ReLU)
*   **Hidden Layer 3:** 16 Neurons (ReLU)
*   **Output Layer:** 1 Neuron (Linear Activation for Regression)

---

## Slide 6: Model Compilation & Training
*   **Optimizer:** Adam
*   **Loss Function:** Mean Squared Error (MSE)
*   **Metrics Tracked:** Mean Absolute Error (MAE)
*   **Training Setup:** 150 Epochs, Batch Size of 8, 80:20 Train/Test Split.

---

## Slide 7: Evaluation & Results
*   **Metrics:** 
    *   Evaluated using MAE, MSE, RMSE, and R² Score.
*   **Performance:**
    *   Scatter plot of *Actual vs. Predicted Prices* shows strong positive correlation.
    *   *Training vs. Validation Loss* curve shows stable convergence without overfitting.

---

## Slide 8: Web Application Deployment
*   **Tool:** Streamlit
*   **Features:**
    *   Interactive sidebar for user inputs.
    *   Real-time processing through the exported `.keras` model and `.pkl` scaler.
    *   Dynamic price estimation display.
*   *Live Demo / Screenshot*

---

## Slide 9: Conclusion & Future Scope
*   **Conclusion:** Deep learning successfully captures complex, non-linear patterns in real estate data.
*   **Future Scope:** 
    *   Incorporate more features (e.g., proximity to schools, crime rate).
    *   Deploy on cloud platforms (AWS, Google Cloud, Heroku) for public access.
    *   Compare with ensemble methods like Random Forest or XGBoost.

---

## Slide 10: Questions
**Thank You!**
*Any Questions?*
