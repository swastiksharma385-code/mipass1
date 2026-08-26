const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'medcluster.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS patients (
      patient_id TEXT PRIMARY KEY,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL,
      symptoms TEXT NOT NULL,
      temperature REAL,
      heart_rate INTEGER,
      systolic_bp INTEGER,
      diastolic_bp INTEGER,
      respiratory_rate INTEGER,
      oxygen_saturation REAL,
      wbc REAL,
      hemoglobin REAL,
      platelets INTEGER,
      crp REAL,
      blood_glucose INTEGER,
      creatinine REAL,
      alt INTEGER,
      ast INTEGER,
      history_diabetes INTEGER DEFAULT 0,
      history_hypertension INTEGER DEFAULT 0,
      history_cardiac INTEGER DEFAULT 0,
      history_respiratory INTEGER DEFAULT 0,
      previous_hospitalization INTEGER DEFAULT 0,
      synthetic_clinical_pattern TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ai_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id TEXT UNIQUE,
      priority TEXT,
      priority_score INTEGER,
      cluster_id INTEGER,
      similarity_score REAL,
      data_quality_score REAL,
      data_quality_status TEXT,
      missing_fields TEXT,
      contributing_factors TEXT,
      similar_patients TEXT,
      explanation TEXT,
      model_version TEXT,
      analyzed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      patient_id TEXT,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;

