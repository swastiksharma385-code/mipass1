const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const {
    search = '',
    priority = '',
    gender = '',
    minAge = 0,
    maxAge = 120,
    symptom = '',
    clusterId = '',
    sortBy = 'patient_id',
    sortOrder = 'ASC',
    page = 1,
    limit = 15
  } = req.query;

  let query = `
    SELECT p.*, r.priority, r.priority_score, r.cluster_id, r.similarity_score, r.data_quality_score, r.data_quality_status
    FROM patients p
    LEFT JOIN ai_results r ON p.patient_id = r.patient_id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    query += ` AND (p.patient_id LIKE ? OR p.symptoms LIKE ? OR p.synthetic_clinical_pattern LIKE ?)`;
    const sTerm = `%${search}%`;
    params.push(sTerm, sTerm, sTerm);
  }

  if (gender) {
    query += ` AND p.gender = ?`;
    params.push(gender);
  }

  if (minAge) {
    query += ` AND p.age >= ?`;
    params.push(parseInt(minAge, 10));
  }

  if (maxAge) {
    query += ` AND p.age <= ?`;
    params.push(parseInt(maxAge, 10));
  }

  if (symptom) {
    query += ` AND p.symptoms LIKE ?`;
    params.push(`%${symptom}%`);
  }

  if (priority) {
    query += ` AND r.priority = ?`;
    params.push(priority);
  }

  if (clusterId !== '') {
    query += ` AND r.cluster_id = ?`;
    params.push(parseInt(clusterId, 10));
  }

  const countQuery = `SELECT COUNT(*) as total FROM (${query})`;
  db.get(countQuery, params, (err, countRow) => {
    if (err) {
      console.error('[DB ERROR]', err);
      return res.status(500).json({ error: err.message });
    }

    const total = countRow ? countRow.total : 0;
    const pNum = Math.max(1, parseInt(page, 10));
    const pLimit = Math.max(1, parseInt(limit, 10));
    const offset = (pNum - 1) * pLimit;

    const allowedSort = ['patient_id', 'age', 'gender', 'created_at', 'priority_score', 'similarity_score'];
    const validSort = allowedSort.includes(sortBy) ? sortBy : 'patient_id';
    const validOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    query += ` ORDER BY ${validSort} ${validOrder} LIMIT ? OFFSET ?`;
    params.push(pLimit, offset);

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const patients = rows.map(r => {
        let syms = [];
        try { syms = JSON.parse(r.symptoms); } catch (e) { syms = r.symptoms ? [r.symptoms] : []; }
        return { ...r, symptoms: syms };
      });

      return res.json({
        total,
        page: pNum,
        totalPages: Math.ceil(total / pLimit),
        limit: pLimit,
        patients
      });
    });
  });
});

router.get('/:id', (req, res) => {
  const pid = req.params.id;
  const sql = `
    SELECT p.*, r.priority, r.priority_score, r.cluster_id, r.similarity_score, 
           r.data_quality_score, r.data_quality_status, r.missing_fields, 
           r.contributing_factors, r.similar_patients, r.explanation, r.model_version
    FROM patients p
    LEFT JOIN ai_results r ON p.patient_id = r.patient_id
    WHERE p.patient_id = ?
  `;

  db.get(sql, [pid], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: `Patient ${pid} not found` });

    let symptoms = [];
    try { symptoms = JSON.parse(row.symptoms); } catch (e) { symptoms = [row.symptoms]; }

    let missing_fields = [];
    try { if (row.missing_fields) missing_fields = JSON.parse(row.missing_fields); } catch (e) {}

    let contributing_factors = [];
    try { if (row.contributing_factors) contributing_factors = JSON.parse(row.contributing_factors); } catch (e) {}

    let similar_patients = [];
    try { if (row.similar_patients) similar_patients = JSON.parse(row.similar_patients); } catch (e) {}

    let explanation = {};
    try { if (row.explanation) explanation = JSON.parse(row.explanation); } catch (e) {}

    return res.json({
      ...row,
      symptoms,
      ai_analysis: row.priority ? {
        priority: row.priority,
        priority_score: row.priority_score,
        cluster_id: row.cluster_id,
        similarity_score: row.similarity_score,
        data_quality: {
          quality_score: row.data_quality_score,
          status: row.data_quality_status,
          missing_fields
        },
        contributing_factors,
        similar_patients,
        explanation,
        model_version: row.model_version
      } : null
    });
  });
});

router.post('/', (req, res) => {
  const p = req.body;
  if (!p.age || !p.gender) {
    return res.status(400).json({ error: 'Age and Gender are required fields.' });
  }

  db.get('SELECT COUNT(*) as count FROM patients', [], (err, row) => {
    const newId = p.patient_id || `P${(row ? row.count + 1 : 1).toString().padStart(3, '0')}`;
    const symptomsStr = Array.isArray(p.symptoms) ? JSON.stringify(p.symptoms) : JSON.stringify([]);

    const stmt = db.prepare(`
      INSERT INTO patients (
        patient_id, age, gender, symptoms, temperature, heart_rate,
        systolic_bp, diastolic_bp, respiratory_rate, oxygen_saturation,
        wbc, hemoglobin, platelets, crp, blood_glucose, creatinine,
        alt, ast, history_diabetes, history_hypertension, history_cardiac,
        history_respiratory, previous_hospitalization, synthetic_clinical_pattern
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      newId, parseInt(p.age, 10), p.gender, symptomsStr,
      p.temperature ? parseFloat(p.temperature) : null,
      p.heart_rate ? parseInt(p.heart_rate, 10) : null,
      p.systolic_bp ? parseInt(p.systolic_bp, 10) : null,
      p.diastolic_bp ? parseInt(p.diastolic_bp, 10) : null,
      p.respiratory_rate ? parseInt(p.respiratory_rate, 10) : null,
      p.oxygen_saturation ? parseFloat(p.oxygen_saturation) : null,
      p.wbc ? parseFloat(p.wbc) : null,
      p.hemoglobin ? parseFloat(p.hemoglobin) : null,
      p.platelets ? parseInt(p.platelets, 10) : null,
      p.crp ? parseFloat(p.crp) : null,
      p.blood_glucose ? parseInt(p.blood_glucose, 10) : null,
      p.creatinine ? parseFloat(p.creatinine) : null,
      p.alt ? parseInt(p.alt, 10) : null,
      p.ast ? parseInt(p.ast, 10) : null,
      p.history_diabetes ? 1 : 0,
      p.history_hypertension ? 1 : 0,
      p.history_cardiac ? 1 : 0,
      p.history_respiratory ? 1 : 0,
      p.previous_hospitalization ? 1 : 0,
      p.synthetic_clinical_pattern || 'Custom Patient Record'
    ], function(err) {
      if (err) return res.status(500).json({ error: err.message });

      db.run('INSERT INTO audit_logs (action, patient_id, details) VALUES (?, ?, ?)', [
        'CREATE_PATIENT', newId, `Added patient age ${p.age}, gender ${p.gender}`
      ]);

      return res.status(201).json({
        message: 'Patient created successfully',
        patient_id: newId
      });
    });
  });
});

module.exports = router;

