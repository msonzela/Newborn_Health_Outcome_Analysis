# Newborn Health Outcome Analysis

## Data Science, Machine Learning & Health Intelligence Dashboard

An end-to-end Data Science portfolio project demonstrating statistical analysis, machine learning, API development, and interactive visualization using synthetic maternal and newborn health data.

**Project status:** Development and validation in progress.

### Project Overview

The project explores patterns in newborn health outcomes, including low birth weight, preterm birth, newborn complications, and neonatal intensive care unit (NICU) admissions.

The analytical workflow uses 5,000 synthetic records representing simulated healthcare facilities across five Tanzanian regions.

**Disclaimer:** All data is synthetic. Findings do not represent actual health outcomes in Tanzania, and the predictive models are not clinically validated.

### Project Objectives

- Explore maternal and newborn health indicators.
- Identify statistical associations within synthetic data.
- Develop machine learning models for low-birth-weight classification.
- Evaluate model performance using appropriate metrics.
- Build interactive dashboards for communicating analytical results.
- Develop a REST API and React frontend.

### Technology Stack

| Component | Technology |
|---|---|
| Programming | Python, JavaScript |
| Data analysis | Pandas, NumPy |
| Statistical analysis | SciPy, Statsmodels |
| Machine learning | Scikit-learn |
| Visualization | Matplotlib, Seaborn, Plotly |
| Analytical dashboard | Streamlit |
| Backend | FastAPI |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Testing | Pytest |

### Dataset

The project uses a reproducible synthetic dataset containing 5,000 newborn records and 21 variables.

Variables include maternal characteristics, antenatal care attendance, delivery information, birth weight, gestational age, and simulated newborn outcomes.

No real patient records are included.

### Machine Learning

The project compares:

1. Dummy Classifier baseline
2. Logistic Regression
3. Random Forest

The training workflow uses stratified training, validation, and held-out test partitions.

Evaluation metrics include ROC-AUC, average precision, precision, recall, F1-score, Brier score, and confusion matrix.

The selected model is determined using validation average precision.

### Dashboard Features

The application includes:

- Executive newborn health indicators
- Regional outcome comparisons
- Low-birth-weight and preterm birth analysis
- Maternal health factor analysis
- Model performance visualization
- Experimental synthetic prediction simulator
- Research limitations and responsible interpretation

### Installation

Clone the repository and create a Python virtual environment.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

### Run the Data Science Pipeline

```bash
python src/data/generate_dataset.py
python src/analysis/eda_analysis.py
python src/analysis/statistical_analysis.py
python src/models/train_models.py
python src/evaluation/evaluate_models.py
```

### Run the Streamlit Dashboard

```bash
python -m streamlit run dashboard/app_v2.py
```

### Run the FastAPI Backend

```bash
python -m uvicorn backend.main:app --reload --port 8000
```

API documentation:

`http://127.0.0.1:8000/docs`

### Run the React Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

`http://localhost:5173`

### Run Automated Tests

From the project root:

```bash
python -m pytest tests/ -v
```

### Research Limitations

- All observations are synthetic.
- Statistical associations may reflect artificial data-generation rules.
- Model predictions have not undergone external clinical validation.
- No prospective assessment has been conducted.
- The system is not intended for patient diagnosis, treatment, triage, or clinical decision-making.

### Future Improvements

- Independent evaluation of model calibration.
- Facility-level and temporal validation.
- Additional model fairness and subgroup assessments.
- Enhanced API testing and deployment configuration.
- Evaluation using appropriately approved, de-identified research datasets.

### Portfolio Focus

This project demonstrates practical skills in data preprocessing, statistical analysis, predictive modeling, evaluation, API engineering, interactive visualization, and research communication.

**Author:** Wilson Vicent  
**Specialization:** Data Science and Data Analytics
