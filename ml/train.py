import os
import sys
import csv
import json
import joblib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from generate_data import generate_synthetic_dataset
from preprocessing import PatientPreprocessor
from clustering import ClusterEngine
from similarity import SimilarityEngine

def load_patients_csv(filepath):
    patients = []
    with open(filepath, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["age"] = int(row["age"]) if row.get("age") else 45
            row["temperature"] = float(row["temperature"]) if row.get("temperature") else None
            row["heart_rate"] = int(row["heart_rate"]) if row.get("heart_rate") else None
            row["systolic_bp"] = int(row["systolic_bp"]) if row.get("systolic_bp") else None
            row["diastolic_bp"] = int(row["diastolic_bp"]) if row.get("diastolic_bp") else None
            row["respiratory_rate"] = int(row["respiratory_rate"]) if row.get("respiratory_rate") else None
            row["oxygen_saturation"] = float(row["oxygen_saturation"]) if row.get("oxygen_saturation") else None
            row["wbc"] = float(row["wbc"]) if row.get("wbc") else None
            row["hemoglobin"] = float(row["hemoglobin"]) if row.get("hemoglobin") else None
            row["platelets"] = int(row["platelets"]) if row.get("platelets") else None
            row["crp"] = float(row["crp"]) if row.get("crp") else None
            row["blood_glucose"] = int(row["blood_glucose"]) if row.get("blood_glucose") else None
            row["creatinine"] = float(row["creatinine"]) if row.get("creatinine") else None
            row["alt"] = int(row["alt"]) if row.get("alt") else None
            row["ast"] = int(row["ast"]) if row.get("ast") else None
            row["history_diabetes"] = int(row["history_diabetes"]) if row.get("history_diabetes") else 0
            row["history_hypertension"] = int(row["history_hypertension"]) if row.get("history_hypertension") else 0
            row["history_cardiac"] = int(row["history_cardiac"]) if row.get("history_cardiac") else 0
            row["history_respiratory"] = int(row["history_respiratory"]) if row.get("history_respiratory") else 0
            row["previous_hospitalization"] = int(row["previous_hospitalization"]) if row.get("previous_hospitalization") else 0
            patients.append(row)
    return patients

def train_and_save_pipeline():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(base_dir, "data", "synthetic_patients.csv")
    
    if not os.path.exists(data_path):
        print("[INFO] Synthetic dataset missing. Generating now...")
        patients = generate_synthetic_dataset(num_patients=500)
    else:
        patients = load_patients_csv(data_path)
        print(f"[INFO] Loaded {len(patients)} patient records from {data_path}")

    print("[INFO] Fitting PatientPreprocessor...")
    preprocessor = PatientPreprocessor()
    preprocessor.fit(patients)

    print("[INFO] Fitting ClusterEngine (K-Means, K=5)...")
    cluster_engine = ClusterEngine(n_clusters=5)
    cluster_engine.fit(patients, preprocessor)

    print("[INFO] Fitting SimilarityEngine...")
    similarity_engine = SimilarityEngine(preprocessor)
    similarity_engine.fit(patients)

    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)
    artifact_path = os.path.join(models_dir, "model_v1.joblib")
    
    pipeline_artifact = {
        "model_version": "medcluster-v1.0",
        "preprocessor": preprocessor,
        "cluster_engine": cluster_engine,
        "similarity_engine": similarity_engine,
        "dataset_df": patients
    }
    
    joblib.dump(pipeline_artifact, artifact_path)
    print(f"[SUCCESS] Trained MedCluster AI pipeline saved to {artifact_path}")
    print(f"[METRIC] Clustering Silhouette Score: {cluster_engine.silhouette_val:.3f}")
    return pipeline_artifact

if __name__ == "__main__":
    train_and_save_pipeline()
