import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sparkles, Network, ArrowLeft, AlertTriangle, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const PatientAnalysisPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    runAnalysis();
  }, [id]);

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.analyzePatient(id);
      setAnalysis(res.data);
    } catch (err) {
      setError(err.response?.data?.error || `Failed to analyze patient ${id}.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="loading-spinner" style={{ width: '40px', height: '40px' }}></div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginTop: '1.25rem' }}>
          Analyzing Clinical Vector Representation for Patient {id}...
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>
          Preprocessing vitals & labs → Calculating distance metrics → Assigning K-Means cluster → Building XAI attributions
        </p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', background: '#fef2f2', borderColor: '#fca5a5' }}>
        <AlertTriangle size={36} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
        <h2 style={{ fontSize: '1.25rem', color: '#991b1b' }}>Analysis Execution Failed</h2>
        <p style={{ color: '#7f1d1d', margin: '0.5rem 0 1.5rem 0' }}>{error}</p>
        <button onClick={runAnalysis} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  const { triage, cluster, data_quality, similar_patients, explanation, model_version } = analysis;
  const prio = triage.priority;
  const badgeClass = prio === 'HIGH' ? 'badge-high' : (prio === 'LOW' ? 'badge-low' : 'badge-medium');

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => navigate(`/patients/${id}`)} className="btn btn-outline" style={{ padding: '0.4rem 0.75rem' }}>
            <ArrowLeft size={16} /> Patient Profile
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              AI Clinical Analysis Results: {id}
              <span className={`badge ${badgeClass}`}>{prio} Priority ({triage.priority_score}/100)</span>
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Model Version: {model_version}</p>
          </div>
        </div>

        <Link to={`/similar/${id}`} className="btn btn-primary">
          <Network size={16} /> View Similar Cohort ({similar_patients.length} matches)
        </Link>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ borderLeft: `5px solid ${prio === 'HIGH' ? '#ef4444' : (prio === 'LOW' ? '#10b981' : '#f59e0b')}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>Transparent Triage Rating</h3>
            <span className={`badge ${badgeClass}`}>{prio}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: '800', color: prio === 'HIGH' ? '#dc2626' : '#0f172a' }}>
              {triage.priority_score}
            </span>
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '600' }}>/ 100 Clinical Risk Index</span>
          </div>

          <h4 style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Contributing Physiological Factors:
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {triage.contributing_factors.map((fact, idx) => (
              <li key={idx} style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', marginBottom: '0.4rem', fontSize: '0.8125rem', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{fact.factor}:</strong> <span style={{ color: '#64748b' }}>{fact.detail}</span>
                </div>
                <span style={{ fontWeight: '700', color: '#dc2626' }}>+{fact.points} pts</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
            Data Quality & Cluster Assignment
          </h3>

          <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #bae6fd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: '600' }}>Data Completeness Score</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0284c7' }}>{data_quality.quality_score}%</div>
              </div>
              <span style={{ fontWeight: '700', fontSize: '0.8125rem', color: data_quality.status === 'GOOD' ? '#059669' : '#d97706', background: '#ffffff', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                {data_quality.status}
              </span>
            </div>
            {data_quality.missing_fields.length > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '0.5rem' }}>
                Missing fields: {data_quality.missing_fields.join(', ')}
              </p>
            )}
          </div>

          <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Assigned Clustering Group</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginTop: '0.15rem' }}>
              Cluster {cluster.cluster_id + 1}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              2D PCA Feature Coordinates: ({cluster.pca_x}, {cluster.pca_y})
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Network color="#0284c7" size={18} /> Top Similar Historical Patient Cases
          </h3>
          <Link to={`/similar/${id}`} style={{ fontSize: '0.8125rem', color: '#0284c7', fontWeight: '600' }}>
            Open Full Cohort View →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {similar_patients.map((sim) => (
            <div key={sim.patient_id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '0.5rem', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: '700', color: '#0284c7' }}>{sim.patient_id}</span>
                <span style={{ fontWeight: '800', color: '#059669', fontSize: '0.875rem' }}>{sim.similarity_score}% Match</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                {sim.age} yrs • {sim.gender} • {sim.synthetic_clinical_pattern || 'Pattern'}
              </div>
              <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.75rem', color: '#475569' }}>
                {sim.shared_features.slice(0, 2).map((feat, fIdx) => (
                  <li key={fIdx}>{feat}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: '#f8fafc' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck color="#0284c7" size={18} /> Explainable AI (XAI) Decision Support Summary
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.75rem', lineHeight: '1.5' }}>
          {explanation.cluster_explanation}
        </p>

        <div style={{ padding: '0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#9a3412' }}>
          {explanation.disclaimer}
        </div>
      </div>
    </div>
  );
};

export default PatientAnalysisPage;

