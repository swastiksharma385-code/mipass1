import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Network, ArrowLeft, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const SimilarPatientsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarCohort();
  }, [id]);

  const fetchSimilarCohort = async () => {
    setLoading(true);
    try {
      const res = await api.analyzePatient(id);
      const pRes = await api.getPatientById(id);
      setPatientData({
        target: pRes.data,
        analysis: res.data
      });
    } catch (err) {
      console.error('Error fetching similar cohort:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Searching Similarity Matrix for Patient {id}...</p>
      </div>
    );
  }

  const target = patientData?.target;
  const analysis = patientData?.analysis;
  const similarList = analysis?.similar_patients || [];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate(-1)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>
              Clinically Similar Patients Cohort ({id})
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Top historical cases matching normalized feature representations (Cosine + Euclidean distance)
            </p>
          </div>
        </div>

        <Link to={`/analysis/${id}`} className="btn btn-outline">
          <Sparkles size={16} /> View AI Analysis
        </Link>
      </div>

      {target && (
        <div className="card" style={{ background: '#f8fafc', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0284c7', marginBottom: '0.5rem' }}>
            Target Reference Case: {target.patient_id}
          </h3>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#334155' }}>
            <span><strong>Age/Gender:</strong> {target.age} yrs / {target.gender}</span>
            <span><strong>Vitals Baseline:</strong> {target.oxygen_saturation}% O2 • {target.heart_rate} bpm • {target.systolic_bp}/{target.diastolic_bp} mmHg</span>
            <span><strong>Pattern:</strong> {target.synthetic_clinical_pattern || 'General'}</span>
          </div>
        </div>
      )}

      <div className="card" style={{ background: '#ecfdf5', borderColor: '#6ee7b7', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontSize: '0.875rem' }}>
          <ShieldCheck size={20} />
          <span>
            <strong>Clinical Safety Protocol:</strong> Similarity matching indicates feature pattern proximity across vitals, labs, and symptoms. High feature similarity does <em>not</em> guarantee identical underlying etiology or outcome.
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {similarList.map((sim, index) => (
          <div key={sim.patient_id} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0284c7' }}>#{index + 1} Patient {sim.patient_id}</span>
                  <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #6ee7b7', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: '800' }}>
                    {sim.similarity_score}% Similarity Score
                  </span>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  {sim.age} yrs • {sim.gender} • Clinical Pattern Group: <strong>{sim.synthetic_clinical_pattern || 'General'}</strong>
                </div>

                <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#334155', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  Primary Matching Features:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {sim.shared_features.map((feat, fIdx) => (
                    <span key={fIdx} style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to={`/patients/${sim.patient_id}`} className="btn btn-outline">
                  <Eye size={14} /> Profile
                </Link>
                <Link to={`/analysis/${sim.patient_id}`} className="btn btn-primary">
                  <Sparkles size={14} /> Analyze
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarPatientsPage;

