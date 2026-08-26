# MEDCLUSTER AI

> **AI-Assisted Patient Similarity, Intelligent Triage & Clinical Decision-Support Platform**

MedCluster AI is a college/research prototype designed to assist healthcare professionals by grouping clinically similar patients, calculating transparent physiological priority scores, and visualizing patient clusters without replacing doctor judgment.

---

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Innovations](#key-innovations)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Step-by-Step Setup Instructions (Windows)](#step-by-step-setup-instructions-windows)
6. [Running the Application](#running-the-application)
7. [Testing & Evaluation](#testing--evaluation)
8. [Medical Safety Disclaimer](#medical-safety-disclaimer)

---

## 🏥 Project Overview

Hospitals can receive very large numbers of patients while having a limited number of doctors. MedCluster AI uses AI/ML to:
- Convert patient demographics, symptoms, vitals, labs, and history into 31-dimensional feature vectors.
- Identify patients with similar clinical patterns using Cosine and Euclidean similarity metrics.
- Automatically group patients using unsupervised K-Means clustering.
- Provide transparent triage risk ratings (`HIGH`, `MEDIUM`, `LOW`) with explicit contributing factors.
- Present everything through a responsive doctor dashboard.

---

## 💡 Key Innovations
- **Patient Similarity Engine**: Multi-dimensional distance calculations matching cases by feature patterns.
- **Unsupervised Clustering**: K-Means clustering with Silhouette metric and 2D PCA feature projection.
- **Transparent Triage & XAI**: Explainable feature attributions for priority and cluster assignment.
- **Workload Queue Simulation**: Model comparing standard queue vs AI-assisted prioritization.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind/CSS, Lucide Icons, Recharts |
| **Backend API** | Node.js, Express.js, SQLite 3 (Default zero-setup) / PostgreSQL |
| **ML Engine** | Python 3, FastAPI, scikit-learn, pandas, numpy, joblib |

---

## 📁 Folder Structure

```
clinixai/
├── backend/                  # Node.js Express REST API server & DB adapter
│   ├── server.js             # Express app entry point
│   ├── db.js                 # SQLite database initialization
│   ├── seed.js               # Database seeder (500 patient records)
│   ├── routes/               # API route handlers
│   └── test_backend.js       # Backend test script
├── ml/                       # Python FastAPI Machine Learning Service
│   ├── generate_data.py      # Generates 500 realistic synthetic patient records
│   ├── preprocessing.py      # 31D vector preprocessor & data quality evaluator
│   ├── similarity.py         # Cosine + Euclidean patient similarity engine
│   ├── clustering.py         # K-Means clustering & PCA 2D scatter plot generator
│   ├── triage.py             # Transparent clinical priority triage engine
│   ├── explainability.py     # Explainable AI (XAI) feature attribution generator
│   ├── train.py              # Model artifact training script
│   ├── evaluate_ml.py        # ML evaluation report generator
│   ├── api.py                # FastAPI endpoints
│   └── test_ml.py            # Pytest test suite
├── src/                      # React 19 Vite Frontend
│   ├── components/           # Navbar, Sidebar
│   ├── pages/                # 12 functional pages
│   ├── services/             # API client integration
│   ├── App.jsx               # Main React router layout
│   └── index.css             # Healthcare enterprise stylesheet
├── schema.sql                # PostgreSQL production database schema
├── API.md                    # REST API documentation
├── ARCHITECTURE.md           # System architecture overview
├── ML.md                     # Machine learning pipeline specification
├── DATABASE.md               # Database driver documentation
├── SECURITY.md               # Security guidelines
├── MEDICAL_SAFETY.md         # Clinical safety statement
├── FUTURE_INTEGRATION.md     # FHIR & Multimodal AI roadmap
├── DEPLOYMENT.md             # Cloud deployment instructions
├── SMOKE_TEST.md             # End-to-end smoke test guide
└── PRESENTATION_NOTES.md     # 12-slide presentation structure & Viva Q&A
```

---

## 🚀 Step-by-Step Setup Instructions (Windows)

Open **VS Code Terminal** or **PowerShell** in `c:\Users\Lenovo\OneDrive\Desktop\CODING\clinixai`.

### Step 1: Python Virtual Environment & ML Setup
```cmd
cd ml
python -m venv venv
venv\Scripts\python -m pip install --upgrade pip
venv\Scripts\pip install -r requirements.txt
```

### Step 2: Generate Synthetic Data & Train ML Model
```cmd
venv\Scripts\python generate_data.py
venv\Scripts\python train.py
venv\Scripts\python evaluate_ml.py
```

### Step 3: Backend Setup & Database Seeding
Open a new terminal tab:
```cmd
cd backend
npm install
node seed.js
```

### Step 4: Frontend Setup
In the project root directory:
```cmd
npm install --legacy-peer-deps
```

---

## 🏃 Running the Application

To run the full stack locally, open 3 terminal tabs:

**Terminal 1 (Python ML Service)**:
```cmd
cd ml
venv\Scripts\python -m uvicorn api:app --port 8000 --reload
```

**Terminal 2 (Express Backend API)**:
```cmd
cd backend
node server.js
```

**Terminal 3 (React Vite Frontend)**:
```cmd
npm run dev
```

Open your web browser at **`http://localhost:5173`**.

---

## 🧪 Testing & Evaluation
- **Backend Tests**: `cd backend && npm test`
- **ML Pytest**: `cd ml && venv\Scripts\pytest`
- **ML Evaluation Report**: `cd ml && venv\Scripts\python evaluate_ml.py`

---

## ⚠️ Medical Safety Disclaimer
> "MedCluster AI is an educational/research prototype. AI outputs are generated for decision-support demonstration only and must not be interpreted as medical diagnosis, treatment advice, or emergency medical guidance. Healthcare professionals must independently evaluate all clinical information."
