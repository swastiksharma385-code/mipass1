import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const WorkflowSimulationPage = () => {
  const [params, setParams] = useState({
    patientCount: 100,
    doctorCount: 5,
    avgReviewMinutes: 15,
    highPriorityPercent: 25
  });

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    runSimulation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation(params);
      setSimResult(res.data);
    } catch (err) {
      console.error('Simulation calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu color="#0284c7" size={26} /> Hospital Workload & Triage Simulation
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Simulate hospital emergency room queue organization under AI-Assisted Priority Triage vs Standard First-Come-First-Serve
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem' }}>
          Simulation Input Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Total Arriving Patients</label>
            <input type="number" name="patientCount" className="input-field" value={params.patientCount} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Available Doctors / Clinicians</label>
            <input type="number" name="doctorCount" className="input-field" value={params.doctorCount} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Avg Doctor Review Time (mins)</label>
            <input type="number" name="avgReviewMinutes" className="input-field" value={params.avgReviewMinutes} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated High Priority %</label>
            <input type="number" name="highPriorityPercent" className="input-field" value={params.highPriorityPercent} onChange={handleChange} />
          </div>
        </div>

        <button onClick={runSimulation} className="btn btn-primary" style={{ marginTop: '0.5rem' }} disabled={loading}>
          {loading ? <span className="loading-spinner"></span> : 'Recalculate Workload Simulation'}
        </button>
      </div>

      {simResult && (
        <>
          <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
            <div className="card" style={{ borderColor: '#fca5a5', background: '#fff5f5' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem' }}>
                Standard Queue (First-Come-First-Serve)
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#7f1d1d', marginBottom: '1rem' }}>
                {simResult.standard_fcfs.risk_factor}
              </p>

              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #fecaca', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: '600' }}>Avg Wait Time for Critical Patients</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#dc2626' }}>
                  {simResult.standard_fcfs.avg_wait_high_priority_hours} hrs
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#475569' }}>
                Time to first critical case review: <strong>{simResult.standard_fcfs.time_to_first_critical_review_mins} mins</strong>
              </div>
            </div>

            <div className="card" style={{ borderColor: '#6ee7b7', background: '#f0fdf4' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>
                AI-Assisted Intelligent Priority Triage
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#047857', marginBottom: '1rem' }}>
                {simResult.ai_prioritized.safety_benefit}
              </p>

              <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #a7f3d0', marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '600' }}>Avg Wait Time for Critical Patients</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669' }}>
                  {simResult.ai_prioritized.avg_wait_high_priority_hours} hrs
                </div>
              </div>

              <div style={{ fontSize: '0.8125rem', color: '#047857', fontWeight: '700' }}>
                ✓ Estimated Wait Time Reduction: {simResult.ai_prioritized.estimated_high_priority_wait_reduction_pct}% Faster
              </div>
            </div>
          </div>

          <div className="card" style={{ background: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#334155', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} color="#0284c7" /> Simulation Disclaimer
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              {simResult.disclaimer}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkflowSimulationPage;

