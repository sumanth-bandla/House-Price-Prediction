import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import joblib

def main():
    # 1. Project Setup
    print("Initializing Project Directories...")
    os.makedirs('models', exist_ok=True)
    os.makedirs('plots', exist_ok=True)

    # 2. Load Dataset
    print("\nStep 1: Loading Dataset...")
    df = pd.read_csv('dataset/housing.csv')
    print(f"Dataset loaded successfully with shape: {df.shape}")

    # 3. Exploratory Data Analysis (EDA) & Cleaning
    print("\nStep 2: Cleaning Data & EDA...")
    df.dropna(inplace=True) # Handle missing values
    df.drop_duplicates(inplace=True) # Handle duplicates

    # Encode Categorical Variables
    print("Encoding categorical variables...")
    df = pd.get_dummies(df, columns=['Location'], drop_first=True)
    
    # Visualization: Price Distribution
    plt.figure(figsize=(8,6))
    sns.histplot(df['Price'], kde=True, color='blue')
    plt.title('Distribution of House Prices')
    plt.xlabel('Price ($)')
    plt.savefig('plots/price_distribution.png')
    plt.close()
    
    # Visualization: Correlation Matrix
    plt.figure(figsize=(10,8))
    sns.heatmap(df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Feature Correlation Matrix')
    plt.savefig('plots/correlation_matrix.png')
    plt.close()

    # 4. Preprocessing & Splitting
    print("\nStep 3: Preprocessing & Train-Test Split (80:20)...")
    X = df.drop('Price', axis=1)
    y = df['Price']
    
    # 80:20 Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 5. Normalization
    print("Normalizing features using StandardScaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Save the scaler for inference
    joblib.dump(scaler, 'models/scaler.pkl')

    # 6. Build the ANN Architecture
    print("\nStep 4: Building the Artificial Neural Network...")
    model = Sequential([
        # Input Layer is implicitly defined by input_shape in the first Hidden Layer
        Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],), name='Hidden_Layer_1'),
        Dense(32, activation='relu', name='Hidden_Layer_2'),
        Dense(16, activation='relu', name='Hidden_Layer_3'),
        Dense(1, activation='linear', name='Output_Layer') # Linear activation for Regression
    ])
    
    model.summary()

    # 7. Compile the Model
    print("\nStep 5: Compiling Model (Adam Optimizer, MSE Loss)...")
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mean_absolute_error'])

    # 8. Train the Model
    print("\nStep 6: Training Model...")
    history = model.fit(
        X_train_scaled, y_train,
        validation_split=0.2,
        epochs=150,
        batch_size=8,
        verbose=1
    )

    # 9. Evaluate the Model
    print("\nStep 7: Evaluating Model on Test Data...")
    y_pred = model.predict(X_test_scaled)
    
    mae = mean_absolute_error(y_test, y_pred)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    print("-" * 30)
    print(f"Mean Absolute Error (MAE): {mae:,.2f}")
    print(f"Mean Squared Error (MSE):  {mse:,.2f}")
    print(f"Root Mean Squared (RMSE):  {rmse:,.2f}")
    print(f"R-Squared (R2) Score:      {r2:.4f}")
    print("-" * 30)

    # 10. Visualizations of Results
    # Plot Training vs Validation Loss
    plt.figure(figsize=(10,6))
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss (MSE) Over Epochs')
    plt.xlabel('Epochs')
    plt.ylabel('Loss (Mean Squared Error)')
    plt.legend()
    plt.savefig('plots/training_vs_validation_loss.png')
    plt.close()

    # Plot Actual vs Predicted Prices
    plt.figure(figsize=(10,6))
    plt.scatter(y_test, y_pred, alpha=0.7, color='green')
    plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
    plt.xlabel('Actual Prices ($)')
    plt.ylabel('Predicted Prices ($)')
    plt.title('Actual vs Predicted House Prices')
    plt.savefig('plots/actual_vs_predicted.png')
    plt.close()

    # 11. Save the Trained Model
    print("\nStep 8: Saving the Model...")
    model.save('models/ann_model.keras')
    print("Project executed successfully! Check the 'plots' and 'models' directories.")

if __name__ == "__main__":
    main()
