import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const ALL_SYMPTOMS = [
  'Fever', 'Cough', 'Breathlessness', 'Chest pain', 'Fatigue',
  'Headache', 'Nausea', 'Vomiting', 'Abdominal pain', 'Dizziness', 'Weakness'
];

const AddPatientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patient_id: '',
    age: '52',
    gender: 'Male',
    symptoms: ['Fever', 'Cough', 'Breathlessness'],
    temperature: '38.6',
    heart_rate: '104',
    systolic_bp: '135',
    diastolic_bp: '85',
    respiratory_rate: '24',
    oxygen_saturation: '91.5',
    wbc: '14.5',
    hemoglobin: '13.2',
    platelets: '260',
    crp: '68.0',
    blood_glucose: '130',
    creatinine: '1.1',
    alt: '35',
    ast: '38',
    history_diabetes: false,
    history_hypertension: true,
    history_cardiac: false,
    history_respiratory: true,
    previous_hospitalization: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSymptomToggle = (sym) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(sym);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter(s => s !== sym) : [...prev.symptoms, sym]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const o2 = parseFloat(formData.oxygen_saturation);
    if (o2 && (o2 < 50 || o2 > 100)) {
      setError('Oxygen Saturation must be between 50% and 100%.');
      return;
    }

    const temp = parseFloat(formData.temperature);
    if (temp && (temp < 30 || temp > 45)) {
      setError('Body temperature must be between 30°C and 45°C.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age, 10),
        history_diabetes: formData.history_diabetes ? 1 : 0,
        history_hypertension: formData.history_hypertension ? 1 : 0,
        history_cardiac: formData.history_cardiac ? 1 : 0,
        history_respiratory: formData.history_respiratory ? 1 : 0,
        previous_hospitalization: formData.previous_hospitalization ? 1 : 0
      };

      const res = await api.createPatient(payload);
      const newId = res.data.patient_id;
      navigate(`/patients/${newId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register patient record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>Register New Patient Record</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Enter demographics, clinical symptoms, vitals & laboratory panels</p>
        </div>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem' }}>
            1. Patient Demographics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Patient ID (Optional / Auto)</label>
              <input
                type="text"
                name="patient_id"
                className="input-field"
                placeholder="e.g. P501 (Auto-generated if blank)"
                value={formData.patient_id}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Age (Years) *</label>
              <input
                type="number"
                name="age"
                min="18"
                max="105"
                className="input-field"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select name="gender" className="select-field" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '0.75rem' }}>
            2. Presenting Clinical Symptoms
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1rem' }}>Select all reported symptoms:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {ALL_SYMPTOMS.map((sym) => {
              const isSelected = formData.symptoms.includes(sym);
              return (
                <button
                  type="button"
                  key={sym}
                  onClick={() => handleSymptomToggle(sym)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    border: isSelected ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    background: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#334155',
                    textAlign: 'left'
                  }}
                >
                  <span>{sym}</span>
                  {isSelected && <CheckCircle size={14} color="#0284c7" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem' }}>
            3. Physiological Vital Signs
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">O2 Saturation (%)</label>
              <input type="number" step="0.1" name="oxygen_saturation" className="input-field" value={formData.oxygen_saturation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Heart Rate (bpm)</label>
              <input type="number" name="heart_rate" className="input-field" value={formData.heart_rate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Systolic BP (mmHg)</label>
              <input type="number" name="systolic_bp" className="input-field" value={formData.systolic_bp} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Diastolic BP (mmHg)</label>
              <input type="number" name="diastolic_bp" className="input-field" value={formData.diastolic_bp} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Respiratory Rate (/min)</label>
              <input type="number" name="respiratory_rate" className="input-field" value={formData.respiratory_rate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input type="number" step="0.1" name="temperature" className="input-field" value={formData.temperature} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem' }}>
            4. Laboratory Values
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">WBC (x10^3/uL)</label>
              <input type="number" step="0.1" name="wbc" className="input-field" value={formData.wbc} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">CRP (mg/L)</label>
              <input type="number" step="0.1" name="crp" className="input-field" value={formData.crp} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Glucose (mg/dL)</label>
              <input type="number" name="blood_glucose" className="input-field" value={formData.blood_glucose} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Creatinine (mg/dL)</label>
              <input type="number" step="0.1" name="creatinine" className="input-field" value={formData.creatinine} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Hemoglobin (g/dL)</label>
              <input type="number" step="0.1" name="hemoglobin" className="input-field" value={formData.hemoglobin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Platelets (x10^3/uL)</label>
              <input type="number" name="platelets" className="input-field" value={formData.platelets} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '0.75rem' }}>
            5. Pre-existing History & Risk Factors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="history_diabetes" checked={formData.history_diabetes} onChange={handleChange} />
              Diabetes History
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="history_hypertension" checked={formData.history_hypertension} onChange={handleChange} />
              Hypertension History
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="history_cardiac" checked={formData.history_cardiac} onChange={handleChange} />
              Cardiac History
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="history_respiratory" checked={formData.history_respiratory} onChange={handleChange} />
              Chronic Respiratory History
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
              <input type="checkbox" name="previous_hospitalization" checked={formData.previous_hospitalization} onChange={handleChange} />
              Previous Hospitalization (Last 12 mo)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <button type="button" onClick={() => navigate('/patients')} className="btn btn-outline" style={{ padding: '0.65rem 1.5rem' }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }} disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Save Patient & View Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatientPage;

