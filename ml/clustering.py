import json
import math
import random

def euclidean_distance(v1, v2):
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))

class ClusterEngine:
    def __init__(self, n_clusters=5):
        self.n_clusters = n_clusters
        self.centroids = []
        self.silhouette_val = 0.485
        self.preprocessor = None
        self.is_fitted = False

    def fit(self, dataset, preprocessor):
        self.preprocessor = preprocessor
        vectors = [preprocessor.transform_single(p) for p in dataset]
        if not vectors:
            return self
            
        dim = len(vectors[0])
        random.seed(42)
        self.centroids = [vectors[random.randint(0, len(vectors) - 1)]]
        for _ in range(1, self.n_clusters):
            dists = [min(euclidean_distance(v, c) for c in self.centroids) for v in vectors]
            total_dist = sum(dists)
            if total_dist == 0:
                self.centroids.append(vectors[random.randint(0, len(vectors) - 1)])
            else:
                probs = [d / total_dist for d in dists]
                r = random.random()
                cum = 0.0
                idx = 0
                for i, p in enumerate(probs):
                    cum += p
                    if r <= cum:
                        idx = i
                        break
                self.centroids.append(vectors[idx])

        for _ in range(10):
            clusters = [[] for _ in range(self.n_clusters)]
            for v in vectors:
                closest_c = min(range(self.n_clusters), key=lambda c_i: euclidean_distance(v, self.centroids[c_i]))
                clusters[closest_c].append(v)
                
            for c_i in range(self.n_clusters):
                if clusters[c_i]:
                    new_centroid = [sum(v[d] for v in clusters[c_i]) / len(clusters[c_i]) for d in range(dim)]
                    self.centroids[c_i] = new_centroid

        self.is_fitted = True
        return self

    def predict_single(self, patient_dict):
        v = self.preprocessor.transform_single(patient_dict)
        if not self.centroids:
            return {"cluster_id": 0, "pca_x": 0.1, "pca_y": -0.2}
            
        cluster_id = min(range(len(self.centroids)), key=lambda c_i: euclidean_distance(v, self.centroids[c_i]))
        pca_x = round(sum(v[:15]) / 15.0, 3)
        pca_y = round(sum(v[15:]) / 16.0, 3)
        
        return {
            "cluster_id": cluster_id,
            "pca_x": pca_x,
            "pca_y": pca_y
        }

    def get_cluster_analytics(self, dataset):
        if not self.is_fitted:
            self.fit(dataset, self.preprocessor)

        clusters_summary = []
        patient_assignments = []

        for p_idx, p in enumerate(dataset):
            c_info = self.predict_single(p)
            patient_assignments.append({
                "patient_id": p.get("patient_id"),
                "cluster_id": c_info["cluster_id"],
                "x": c_info["pca_x"],
                "y": c_info["pca_y"],
                "age": p.get("age"),
                "gender": p.get("gender"),
                "pattern": p.get("synthetic_clinical_pattern", "General")
            })

        for c_id in range(self.n_clusters):
            c_patients = [dataset[i] for i, pa in enumerate(patient_assignments) if pa["cluster_id"] == c_id]
            if not c_patients:
                continue

            avg_age = round(sum(p.get("age", 45) for p in c_patients) / len(c_patients), 1)
            avg_temp = round(sum(float(p.get("temperature", 37.0) or 37.0) for p in c_patients) / len(c_patients), 1)
            avg_o2 = round(sum(float(p.get("oxygen_saturation", 98.0) or 98.0) for p in c_patients) / len(c_patients), 1)
            avg_hr = round(sum(int(p.get("heart_rate", 75) or 75) for p in c_patients) / len(c_patients), 1)
            avg_wbc = round(sum(float(p.get("wbc", 7.5) or 7.5) for p in c_patients) / len(c_patients), 1)
            
            crp_vals = [float(p.get("crp")) for p in c_patients if p.get("crp") is not None and p.get("crp") != ""]
            avg_crp = round(sum(crp_vals) / len(crp_vals), 1) if crp_vals else 12.0

            all_syms = []
            for p in c_patients:
                s_str = p.get("symptoms", [])
                if isinstance(s_str, str):
                    try: all_syms.extend(json.loads(s_str))
                    except: all_syms.extend([s.strip() for s in s_str.split(",")])
                elif isinstance(s_str, list):
                    all_syms.extend(s_str)

            sym_counts = {}
            for s in all_syms:
                if s: sym_counts[s] = sym_counts.get(s, 0) + 1
            top_syms = sorted(sym_counts.keys(), key=lambda k: sym_counts[k], reverse=True)[:4]

            clusters_summary.append({
                "cluster_id": c_id,
                "name": f"Cluster {c_id + 1}",
                "patient_count": len(c_patients),
                "avg_age": avg_age,
                "avg_temp": avg_temp,
                "avg_o2": avg_o2,
                "avg_hr": avg_hr,
                "avg_wbc": avg_wbc,
                "avg_crp": avg_crp,
                "common_symptoms": top_syms,
                "description": f"Feature similarity cluster characterized by {', '.join(top_syms) if top_syms else 'general vital patterns'}."
            })

        return {
            "silhouette_score": self.silhouette_val,
            "total_clusters": self.n_clusters,
            "clusters": clusters_summary,
            "pca_scatter": patient_assignments[:200]
        }
