import csv
import json
import os
import random
import math

def generate_synthetic_dataset(num_patients=500, seed=42):
    random.seed(seed)
    
    patterns = ["Respiratory Pattern", "Cardiovascular Pattern", "Metabolic Pattern", "Inflammatory Pattern", "Low-Risk General"]
    pattern_weights = [0.22, 0.20, 0.18, 0.20, 0.20]
    
    patients = []
    
    for i in range(1, num_patients + 1):
        pid = f"P{i:03d}"
        pattern = random.choices(patterns, weights=pattern_weights)[0]
        gender = random.choice(["Male", "Female", "Other"])
        
        if pattern == "Respiratory Pattern":
            age = int(random.gauss(58, 12))
            symptoms = random.sample(["Fever", "Cough", "Breathlessness", "Fatigue", "Weakness"], k=random.randint(3, 4))
            temp = round(random.uniform(38.1, 40.2), 1)
            hr = int(random.gauss(102, 12))
            sys_bp = int(random.gauss(128, 15))
            dia_bp = int(random.gauss(82, 10))
            resp_rate = int(random.gauss(25, 4))
            o2_sat = round(random.uniform(86.0, 93.5), 1)
            
            wbc = round(random.uniform(11.5, 22.0), 1)
            hgb = round(random.uniform(11.0, 15.5), 1)
            plt = int(random.gauss(260, 50))
            crp = round(random.uniform(45.0, 130.0), 1)
            glucose = int(random.gauss(125, 25))
            creat = round(random.uniform(0.8, 1.4), 2)
            alt = int(random.gauss(32, 10))
            ast = int(random.gauss(35, 12))
            
            hist_diab = 1 if random.random() < 0.3 else 0
            hist_hyp = 1 if random.random() < 0.4 else 0
            hist_card = 0
            hist_resp = 1 if random.random() < 0.6 else 0
            prev_hosp = 1 if random.random() < 0.5 else 0

        elif pattern == "Cardiovascular Pattern":
            age = int(random.gauss(64, 10))
            symptoms = random.sample(["Chest pain", "Breathlessness", "Dizziness", "Fatigue", "Nausea"], k=random.randint(3, 4))
            temp = round(random.uniform(36.5, 37.6), 1)
            hr = int(random.gauss(110, 15))
            sys_bp = int(random.gauss(155, 18))
            dia_bp = int(random.gauss(98, 12))
            resp_rate = int(random.gauss(21, 3))
            o2_sat = round(random.uniform(92.0, 96.5), 1)
            
            wbc = round(random.uniform(7.0, 12.5), 1)
            hgb = round(random.uniform(12.0, 16.0), 1)
            plt = int(random.gauss(240, 45))
            crp = round(random.uniform(12.0, 38.0), 1)
            glucose = int(random.gauss(140, 35))
            creat = round(random.uniform(1.0, 1.9), 2)
            alt = int(random.gauss(40, 15))
            ast = int(random.gauss(48, 18))
            
            hist_diab = 1 if random.random() < 0.45 else 0
            hist_hyp = 1 if random.random() < 0.8 else 0
            hist_card = 1 if random.random() < 0.75 else 0
            hist_resp = 0
            prev_hosp = 1 if random.random() < 0.6 else 0

        elif pattern == "Metabolic Pattern":
            age = int(random.gauss(55, 13))
            symptoms = random.sample(["Fatigue", "Weakness", "Nausea", "Headache", "Dizziness"], k=random.randint(2, 4))
            temp = round(random.uniform(36.6, 37.8), 1)
            hr = int(random.gauss(88, 10))
            sys_bp = int(random.gauss(142, 16))
            dia_bp = int(random.gauss(88, 9))
            resp_rate = int(random.gauss(17, 2))
            o2_sat = round(random.uniform(95.0, 98.5), 1)
            
            wbc = round(random.uniform(6.5, 11.0), 1)
            hgb = round(random.uniform(10.5, 14.0), 1)
            plt = int(random.gauss(210, 40))
            crp = round(random.uniform(8.0, 25.0), 1)
            glucose = int(random.gauss(240, 50))
            creat = round(random.uniform(2.1, 4.8), 2)
            alt = int(random.gauss(45, 15))
            ast = int(random.gauss(42, 14))
            
            hist_diab = 1
            hist_hyp = 1 if random.random() < 0.7 else 0
            hist_card = 1 if random.random() < 0.3 else 0
            hist_resp = 0
            prev_hosp = 1 if random.random() < 0.4 else 0

        elif pattern == "Inflammatory Pattern":
            age = int(random.gauss(46, 14))
            symptoms = random.sample(["Abdominal pain", "Nausea", "Vomiting", "Fever", "Fatigue"], k=random.randint(3, 4))
            temp = round(random.uniform(38.0, 39.8), 1)
            hr = int(random.gauss(96, 12))
            sys_bp = int(random.gauss(122, 14))
            dia_bp = int(random.gauss(78, 9))
            resp_rate = int(random.gauss(19, 3))
            o2_sat = round(random.uniform(96.0, 99.0), 1)
            
            wbc = round(random.uniform(13.0, 24.0), 1)
            hgb = round(random.uniform(11.5, 15.0), 1)
            plt = int(random.gauss(310, 60))
            crp = round(random.uniform(55.0, 140.0), 1)
            glucose = int(random.gauss(115, 20))
            creat = round(random.uniform(0.7, 1.3), 2)
            alt = int(random.gauss(125, 45))
            ast = int(random.gauss(140, 50))
            
            hist_diab = 0
            hist_hyp = 0
            hist_card = 0
            hist_resp = 0
            prev_hosp = 1 if random.random() < 0.35 else 0

        else:  # Low-Risk General
            age = int(random.gauss(34, 11))
            symptoms = random.sample(["Headache", "Fatigue", "Weakness"], k=random.randint(1, 2))
            temp = round(random.uniform(36.4, 37.2), 1)
            hr = int(random.gauss(72, 8))
            sys_bp = int(random.gauss(118, 8))
            dia_bp = int(random.gauss(76, 6))
            resp_rate = int(random.gauss(15, 2))
            o2_sat = round(random.uniform(98.0, 100.0), 1)
            
            wbc = round(random.uniform(5.0, 8.5), 1)
            hgb = round(random.uniform(13.0, 16.5), 1)
            plt = int(random.gauss(250, 35))
            crp = round(random.uniform(0.5, 4.5), 1)
            glucose = int(random.gauss(92, 12))
            creat = round(random.uniform(0.7, 1.1), 2)
            alt = int(random.gauss(22, 7))
            ast = int(random.gauss(24, 7))
            
            hist_diab = 0
            hist_hyp = 0
            hist_card = 0
            hist_resp = 0
            prev_hosp = 0
            
        age = max(18, min(90, age))
        sys_bp = max(85, min(210, sys_bp))
        dia_bp = max(55, min(120, dia_bp))
        resp_rate = max(10, min(36, resp_rate))
        o2_sat = max(80.0, min(100.0, o2_sat))

        if random.random() < 0.05:
            crp = ""
        if random.random() < 0.03:
            alt = ""
            ast = ""

        patients.append({
            "patient_id": pid,
            "age": age,
            "gender": gender,
            "symptoms": json.dumps(symptoms),
            "temperature": temp,
            "heart_rate": hr,
            "systolic_bp": sys_bp,
            "diastolic_bp": dia_bp,
            "respiratory_rate": resp_rate,
            "oxygen_saturation": o2_sat,
            "wbc": wbc,
            "hemoglobin": hgb,
            "platelets": plt,
            "crp": crp,
            "blood_glucose": glucose,
            "creatinine": creat,
            "alt": alt,
            "ast": ast,
            "history_diabetes": hist_diab,
            "history_hypertension": hist_hyp,
            "history_cardiac": hist_card,
            "history_respiratory": hist_resp,
            "previous_hospitalization": prev_hosp,
            "synthetic_clinical_pattern": pattern
        })
        
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)
    csv_file = os.path.join(data_dir, "synthetic_patients.csv")
    fieldnames = list(patients[0].keys())
    
    with open(csv_file, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(patients)

    print(f"[SUCCESS] Generated {len(patients)} synthetic patient records saved to {csv_file}")
    return patients

if __name__ == "__main__":
    generate_synthetic_dataset()
