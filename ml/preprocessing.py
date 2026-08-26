import json
import math

ALL_SYMPTOMS = [
    "Fever", "Cough", "Breathlessness", "Chest pain", "Fatigue",
    "Headache", "Nausea", "Vomiting", "Abdominal pain", "Dizziness", "Weakness"
]

NUMERICAL_FEATURES = [
    "age", "temperature", "heart_rate", "systolic_bp", "diastolic_bp",
    "respiratory_rate", "oxygen_saturation", "wbc", "hemoglobin", "platelets",
    "crp", "blood_glucose", "creatinine", "alt", "ast"
]

BINARY_FEATURES = [
    "history_diabetes", "history_hypertension", "history_cardiac",
    "history_respiratory", "previous_hospitalization"
]

FEATURE_DEFAULTS = {
    "age": 45.0,
    "temperature": 37.0,
    "heart_rate": 75.0,
    "systolic_bp": 120.0,
    "diastolic_bp": 80.0,
    "respiratory_rate": 16.0,
    "oxygen_saturation": 98.0,
    "wbc": 7.5,
    "hemoglobin": 14.0,
    "platelets": 250.0,
    "crp": 5.0,
    "blood_glucose": 100.0,
    "creatinine": 0.9,
    "alt": 25.0,
    "ast": 25.0,
    "history_diabetes": 0,
    "history_hypertension": 0,
    "history_cardiac": 0,
    "history_respiratory": 0,
    "previous_hospitalization": 0
}

FEATURE_STDS = {
    "age": 15.0,
    "temperature": 1.2,
    "heart_rate": 15.0,
    "systolic_bp": 20.0,
    "diastolic_bp": 12.0,
    "respiratory_rate": 4.0,
    "oxygen_saturation": 3.5,
    "wbc": 4.0,
    "hemoglobin": 2.0,
    "platelets": 60.0,
    "crp": 35.0,
    "blood_glucose": 45.0,
    "creatinine": 1.0,
    "alt": 30.0,
    "ast": 30.0
}

class PatientPreprocessor:
    def __init__(self):
        self.is_fitted = True

    def check_data_quality(self, patient_dict):
        required_keys = NUMERICAL_FEATURES + BINARY_FEATURES
        missing_fields = []
        total_fields = len(required_keys) + 1
        
        syms = patient_dict.get("symptoms", [])
        if isinstance(syms, str):
            try: syms = json.loads(syms)
            except: syms = [s.strip() for s in syms.split(",") if s.strip()]
        if not syms:
            missing_fields.append("symptoms")
            
        for k in required_keys:
            val = patient_dict.get(k)
            if val is None or val == "":
                missing_fields.append(k)
                
        present_count = total_fields - len(missing_fields)
        quality_score = round((present_count / total_fields) * 100, 1)
        status = "GOOD" if quality_score >= 90 else ("MODERATE" if quality_score >= 70 else "INCOMPLETE")
        
        return {
            "quality_score": quality_score,
            "status": status,
            "missing_fields": missing_fields
        }

    def extract_raw_features(self, patient_dict):
        syms = patient_dict.get("symptoms", [])
        if isinstance(syms, str):
            try: syms = json.loads(syms)
            except: syms = [s.strip() for s in syms.split(",") if s.strip()]
                
        sym_vector = [1.0 if s in syms else 0.0 for s in ALL_SYMPTOMS]
        
        num_vector = []
        for feat in NUMERICAL_FEATURES:
            val = patient_dict.get(feat)
            if val is None or val == "":
                val = FEATURE_DEFAULTS[feat]
            else:
                val = float(val)
            mean_val = FEATURE_DEFAULTS[feat]
            std_val = FEATURE_STDS[feat]
            z_score = (val - mean_val) / std_val
            num_vector.append(z_score)
            
        bin_vector = []
        for feat in BINARY_FEATURES:
            val = patient_dict.get(feat)
            val = 1.0 if (val is not None and val != "" and int(val) > 0) else 0.0
            bin_vector.append(val)
            
        return sym_vector + num_vector + bin_vector

    def fit(self, dataset):
        return self

    def transform_single(self, patient_dict):
        return self.extract_raw_features(patient_dict)
