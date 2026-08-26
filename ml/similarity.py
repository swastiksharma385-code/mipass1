import os
import sys
import json
import math

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from preprocessing import ALL_SYMPTOMS

def cosine_similarity(v1, v2):
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return dot / (norm1 * norm2)

def euclidean_distance(v1, v2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

class SimilarityEngine:
    def __init__(self, preprocessor):
        self.preprocessor = preprocessor
        self.dataset = []
        self.dataset_vectors = []

    def fit(self, dataset):
        self.dataset = dataset
        self.dataset_vectors = [self.preprocessor.transform_single(p) for p in dataset]

    def find_top_k_similar(self, target_patient_dict, top_k=5):
        if not self.dataset:
            return []

        target_vec = self.preprocessor.transform_single(target_patient_dict)
        target_pid = target_patient_dict.get("patient_id")
        
        scored_patients = []
        for idx, row in enumerate(self.dataset):
            pid = row.get("patient_id")
            if pid == target_pid:
                continue
                
            comp_vec = self.dataset_vectors[idx]
            
            cos_sim = cosine_similarity(target_vec, comp_vec)
            dist = euclidean_distance(target_vec, comp_vec)
            euc_sim = 1.0 / (1.0 + (dist / math.sqrt(len(target_vec))))
            
            composite = (0.6 * cos_sim) + (0.4 * euc_sim)
            score_pct = round(max(1.0, min(99.5, composite * 100)), 1)
            
            shared_features = self.extract_shared_features(target_patient_dict, row)
            
            scored_patients.append({
                "patient_id": pid,
                "similarity_score": score_pct,
                "age": row.get("age"),
                "gender": row.get("gender"),
                "symptoms": row.get("symptoms"),
                "synthetic_clinical_pattern": row.get("synthetic_clinical_pattern"),
                "shared_features": shared_features,
                "_score": score_pct
            })
            
        scored_patients.sort(key=lambda x: x["_score"], reverse=True)
        return scored_patients[:top_k]

    def extract_shared_features(self, target, compare):
        reasons = []
        
        t_age = target.get("age")
        c_age = compare.get("age")
        if t_age and c_age and abs(int(t_age) - int(c_age)) <= 6:
            reasons.append(f"Similar age range ({t_age} vs {c_age} yrs)")

        t_syms = target.get("symptoms", [])
        c_syms = compare.get("symptoms", [])
        if isinstance(t_syms, str):
            try: t_syms = json.loads(t_syms)
            except: t_syms = [s.strip() for s in t_syms.split(",")]
        if isinstance(c_syms, str):
            try: c_syms = json.loads(c_syms)
            except: c_syms = [s.strip() for s in c_syms.split(",")]
            
        common_syms = set(t_syms).intersection(set(c_syms))
        if common_syms:
            reasons.append(f"Matching symptoms ({', '.join(list(common_syms)[:3])})")

        t_o2 = target.get("oxygen_saturation")
        c_o2 = compare.get("oxygen_saturation")
        if t_o2 and c_o2 and abs(float(t_o2) - float(c_o2)) <= 3.0:
            reasons.append(f"Similar oxygen saturation ({t_o2}% vs {c_o2}%)")

        t_crp = target.get("crp")
        c_crp = compare.get("crp")
        if t_crp and c_crp and t_crp != "" and c_crp != "" and abs(float(t_crp) - float(c_crp)) <= 25.0:
            reasons.append("Similar inflammatory CRP level")

        t_wbc = target.get("wbc")
        c_wbc = compare.get("wbc")
        if t_wbc and c_wbc and abs(float(t_wbc) - float(c_wbc)) <= 3.0:
            reasons.append(f"Similar WBC count ({t_wbc} vs {c_wbc})")

        if not reasons:
            reasons.append("Overlapping multi-dimensional feature representation")
            
        return reasons
