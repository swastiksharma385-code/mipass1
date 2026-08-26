import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Activity, Users, Layers, ShieldCheck, ArrowRight, Cpu } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', color: '#0369a1', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: '600', marginBottom: '1rem' }}>
          <ShieldCheck size={16} /> Healthcare AI Academic Prototype
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '1rem' }}>
          MEDCLUSTER AI
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#0284c7', fontWeight: '600', marginBottom: '1rem' }}>
          AI-Assisted Patient Similarity, Intelligent Triage & Clinical Decision-Support Platform
        </p>
        <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '750px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Analyze patient data, discover clinically similar patterns, calculate transparent physiological triage scores, and help healthcare professionals organize hospital workload efficiently.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Doctor Dashboard <ArrowRight size={18} />
          </Link>
          <Link to="/add-patient" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Add Patient
          </Link>
          <Link to="/cluster-explorer" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Patient Similarity
          </Link>
          <Link to="/analytics" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Analytics
          </Link>
        </div>
      </div>

      <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Key Platform Innovations</h2>
      <div className="grid-cols-4" style={{ marginBottom: '2.5rem' }}>
        <div className="card">
          <Activity color="#0284c7" size={28} style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Transparent Triage</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Rule-assisted scoring engine prioritizing patients based on vital derangements (O2, HR, BP, Temp) with explicit contributing factors.
          </p>
        </div>
        <div className="card">
          <Network color="#0284c7" size={28} style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Patient Similarity</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Multi-dimensional cosine and Euclidean feature distance algorithms retrieving historical cases with matching clinical representations.
          </p>
        </div>
        <div className="card">
          <Layers color="#0284c7" size={28} style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Unsupervised Clustering</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            K-Means clustering with Silhouette metric and 2D PCA projection visualizing natural physiological groupings without hardcoded biases.
          </p>
        </div>
        <div className="card">
          <Cpu color="#0284c7" size={28} style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>Workload Simulation</h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Interactive queue model demonstrating potential emergency queue optimization under AI triage vs standard first-come-first-serve.
          </p>
        </div>
      </div>

      <div className="card" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#991b1b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} /> Medical Safety & Clinical Scope Disclaimer
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#7f1d1d', lineHeight: '1.6' }}>
          MedCluster AI is an educational and research prototype. AI-generated information is intended solely as decision-support for healthcare professionals and must not be used as a substitute for professional medical judgment, emergency diagnosis, or treatment decisions. The system does not replace doctors or autonomously prescribe medication.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

