import React from 'react';
import { ShieldCheck, Cpu, Network } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>
          Platform Settings, Versioning & Disclaimers
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Model configuration, safety compliance, multimodal architecture roadmap & FHIR integration
        </p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} /> Active Machine Learning Pipeline Specs
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pipeline Version</div>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>medcluster-v1.0</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Similarity Distance Metric</div>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>Cosine + Weighted Euclidean</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Clustering Algorithm</div>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>K-Means (K=5) + PCA 2D</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Database Engine</div>
            <div style={{ fontWeight: '700', color: '#0f172a' }}>SQLite 3 (PostgreSQL Ready)</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0284c7', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Network size={18} /> Future Multimodal Architecture Roadmap
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '0.5rem', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
              Module 1: NLP Medical Report Summarization
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Planned integration with sentence-transformers and BioBERT to extract clinical entities from physician notes and radiology reports.
            </p>
          </div>

          <div style={{ border: '1px dashed #cbd5e1', padding: '1rem', borderRadius: '0.5rem', background: '#f8fafc' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.35rem' }}>
              Module 2: DICOM Medical Imaging (MONAI / PyTorch)
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Architecture placeholder for DICOM scan embedding extraction combining 3D chest CT/X-ray representations into joint multimodal patient vectors.
            </p>
          </div>
        </div>
      </div>

      <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={18} /> Complete Medical Safety Statement
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#7f1d1d', lineHeight: '1.6' }}>
          MedCluster AI is designed as a college fifth-semester research prototype. AI outputs demonstrate numerical feature similarity and rule-weighted triage organization for academic presentation purposes. The system MUST NOT be deployed in live clinical settings without formal regulatory approval (FDA SaMD / CE mark) and must never override clinical decision-making by licensed healthcare practitioners.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;

