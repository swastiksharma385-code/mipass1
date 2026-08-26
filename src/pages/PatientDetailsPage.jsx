import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Activity, Sparkles, Network, ArrowLeft, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      const res = await api.getPatientById(id);
      setPatient(res.data);
    } catch (err) {
      setError(err.response?.data?.error || `Patient ${id} not found.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading Patient Profile {id}...</p>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#fef2f2', borderColor: '#fca5a5' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: '#991b1b' }}>Patient Record Not Found</h2>
        <p style={{ color: '#7f1d1d', margin: '0.5rem 0 1.5rem 0' }}>{error}</p>
        <Link to="/patients" className="btn btn-outline">Back to Patient Directory</Link>
      </div>
    );
  }

  const ai = patient.ai_analysis;
  const prio = ai?.priority || 'UNANALYZED';
  const badgeClass = prio === 'HIGH' ? 'badge-high' : (prio === 'LOW' ? 'badge-low' : 'badge-medium');

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate('/patients')} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem' }}>
            <ArrowLeft size={16} /> Patients
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Patient {patient.patient_id}
              {prio !== 'UNANALYZED' && <span className={`badge ${badgeClass}`}>{prio}</span>}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              {patient.age} yrs • {patient.gender} • Synthetic Pattern: {patient.synthetic_clinical_pattern || 'Standard'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/analysis/${patient.patient_id}`} className="btn btn-primary">
            <Sparkles size={16} /> {ai ? 'Re-Analyze AI Pipeline' : 'Run AI Analysis'}
          </Link>
          <Link to={`/similar/${patient.patient_id}`} className="btn btn-outline">
            <Network size={16} /> Find Similar Cases
          </Link>
        </div>
      </div>

      {ai && (
        <div className="card" style={{ background: '#f0f9ff', borderColor: '#bae6fd', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                AI Clinical Decision-Support Output ({ai.model_version})
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '0.25rem' }}>
                Priority Rating: <span style={{ color: prio === 'HIGH' ? '#dc2626' : '#d97706' }}>{ai.priority} ({ai.priority_score}/100)</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#334155', marginTop: '0.25rem' }}>
                Assigned Cluster: <strong>Cluster {ai.cluster_id + 1}</strong> • Data Quality: <strong>{ai.data_quality?.quality_score}% ({ai.data_quality?.status})</strong>
              </div>
            </div>
            <Link to={`/analysis/${patient.patient_id}`} className="btn btn-outline" style={{ background: '#ffffff' }}>
              View Detailed AI Attributions →
            </Link>
          </div>
        </div>
      )}

      <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} /> Presenting Symptoms & Vitals
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#64748b' }}>Reported Symptoms:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.35rem' }}>
              {Array.isArray(patient.symptoms) && patient.symptoms.map(s => (
                <span key={s} style={{ background: '#e2e8f0', color: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>O2 Saturation</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.oxygen_saturation < 92 ? '#dc2626' : '#0f172a' }}>
                {patient.oxygen_saturation ? `${patient.oxygen_saturation}%` : 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Heart Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.heart_rate > 110 ? '#dc2626' : '#0f172a' }}>
                {patient.heart_rate ? `${patient.heart_rate} bpm` : 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Blood Pressure</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.systolic_bp > 150 ? '#d97706' : '#0f172a' }}>
                {patient.systolic_bp}/{patient.diastolic_bp} mmHg
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Respiratory Rate</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.respiratory_rate > 22 ? '#dc2626' : '#0f172a' }}>
                {patient.respiratory_rate ? `${patient.respiratory_rate} /min` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem' }}>
            Laboratory Biomarkers
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>WBC Count</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.wbc > 12 ? '#dc2626' : '#0f172a' }}>
                {patient.wbc ? `${patient.wbc} x10^3/uL` : 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>CRP (Inflammation)</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: patient.crp > 40 ? '#dc2626' : '#0f172a' }}>
                {patient.crp ? `${patient.crp} mg/L` : 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Blood Glucose</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                {patient.blood_glucose ? `${patient.blood_glucose} mg/dL` : 'N/A'}
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.65rem', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Serum Creatinine</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                {patient.creatinine ? `${patient.creatinine} mg/dL` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '0.75rem' }}>
          Pre-existing Medical History
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.875rem' }}>
          <span style={{ color: patient.history_diabetes ? '#d97706' : '#64748b', fontWeight: patient.history_diabetes ? '700' : '400' }}>
            {patient.history_diabetes ? '✓ Diabetes' : '✗ No Diabetes'}
          </span>
          <span style={{ color: patient.history_hypertension ? '#d97706' : '#64748b', fontWeight: patient.history_hypertension ? '700' : '400' }}>
            {patient.history_hypertension ? '✓ Hypertension' : '✗ No Hypertension'}
          </span>
          <span style={{ color: patient.history_cardiac ? '#dc2626' : '#64748b', fontWeight: patient.history_cardiac ? '700' : '400' }}>
            {patient.history_cardiac ? '✓ Cardiac History' : '✗ No Cardiac History'}
          </span>
          <span style={{ color: patient.history_respiratory ? '#dc2626' : '#64748b', fontWeight: patient.history_respiratory ? '700' : '400' }}>
            {patient.history_respiratory ? '✓ Chronic Respiratory Disease' : '✗ No Chronic Respiratory'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsPage;

