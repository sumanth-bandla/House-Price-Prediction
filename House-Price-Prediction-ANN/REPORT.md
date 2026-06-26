# Project Report: House Price Prediction Using Artificial Neural Network (ANN)

## 1. Project Objective
The objective of this project is to build an end-to-end Machine Learning solution using an Artificial Neural Network (ANN) to predict house prices based on various structural and locational features. Accurately predicting real estate prices is crucial for buyers, sellers, and investors to make informed decisions. This project demonstrates a complete ML lifecycle from data preprocessing and exploratory data analysis (EDA) to building, evaluating, and deploying a deep learning regression model via a web application.

## 2. Dataset
A real-world housing dataset (CSV format) was used for this project. The dataset contains the following attributes:
*   **Area**: Total square footage of the property.
*   **Bedrooms**: Number of bedrooms.
*   **Bathrooms**: Number of bathrooms.
*   **Age**: Age of the property in years.
*   **Location**: Categorical feature denoting the property setting (Urban, Suburban, Rural).
*   **Price**: Target variable representing the house price in dollars.

## 3. Data Preprocessing & EDA
*   **Missing Values & Duplicates**: The dataset was cleaned by dropping missing values (`dropna()`) and duplicate rows (`drop_duplicates()`).
*   **Exploratory Data Analysis (EDA)**: Visualized the distribution of house prices using a histogram and KDE plot. A correlation matrix was plotted using a seaborn heatmap to identify the relationships between numerical features.
*   **Categorical Encoding**: The `Location` variable was one-hot encoded using Pandas `get_dummies` with `drop_first=True` to avoid the dummy variable trap.
*   **Train-Test Split**: The dataset was split into an 80% training set and a 20% testing set to ensure the model could be evaluated on unseen data.
*   **Normalization**: Numerical features were scaled using `StandardScaler` to ensure that all features contribute equally to the ANN and to improve the convergence rate of the optimizer.

## 4. Artificial Neural Network (ANN) Architecture
The regression model was built using TensorFlow and Keras with the following architecture:
*   **Input Layer**: Implicitly defined by the input shape (number of scaled features).
*   **Hidden Layer 1**: 64 neurons with ReLU (Rectified Linear Unit) activation.
*   **Hidden Layer 2**: 32 neurons with ReLU activation.
*   **Hidden Layer 3**: 16 neurons with ReLU activation.
*   **Output Layer**: 1 neuron with Linear activation (suitable for continuous value regression).

## 5. Model Compilation & Training
*   **Optimizer**: Adam (Adaptive Moment Estimation) was used for efficient gradient descent.
*   **Loss Function**: Mean Squared Error (MSE) was selected as it heavily penalizes larger errors.
*   **Metrics**: Mean Absolute Error (MAE) was tracked for interpretability.
*   **Training**: The model was trained for 150 epochs with a batch size of 8, utilizing a 20% validation split during training to monitor for overfitting.

## 6. Evaluation Metrics
The model was evaluated on the unseen test set yielding robust results based on the following metrics:
*   **MAE (Mean Absolute Error)**: Measures the average magnitude of errors in the predictions.
*   **MSE (Mean Squared Error)**: Measures the average of the squares of the errors.
*   **RMSE (Root Mean Squared Error)**: Provides error in the same units as the target variable (dollars).
*   **R² Score (Coefficient of Determination)**: Indicates the proportion of the variance in the dependent variable that is predictable from the independent variables.

## 7. Results & Visualizations
*   **Training vs Validation Loss**: Plotted over the epochs, demonstrating the learning curve and confirming that the model generalizes well without severe overfitting.
*   **Actual vs Predicted**: A scatter plot showed a strong linear alignment between the actual house prices and the model's predictions, confirming high accuracy.

## 8. Deployment
The trained model (`ann_model.keras`) and standard scaler (`scaler.pkl`) were exported and integrated into a **Streamlit Web Application** (`app.py`). The application allows users to input custom property details via a sidebar and instantly receive an estimated market price predicted by the deep learning model.

## 9. Conclusion
This project successfully demonstrates the application of Artificial Neural Networks for regression tasks. By effectively cleaning data, engineering features, and tuning deep learning architecture, we created a highly responsive and accurate house price prediction tool.
