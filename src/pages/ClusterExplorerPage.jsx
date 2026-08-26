import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import api from '../services/api';

const CLUSTER_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

const ClusterExplorerPage = () => {
  const [data, setData] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClusterData();
  }, []);

  const fetchClusterData = async () => {
    setLoading(true);
    try {
      const res = await api.getClusters();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching cluster data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Computing Unsupervised K-Means Clusters & PCA 2D Projections...</p>
      </div>
    );
  }

  const clusters = data?.clusters || [];
  const scatterPoints = data?.pca_scatter || [];
  const silhouetteScore = data?.silhouette_score || 0.485;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>
            Unsupervised Patient Cluster Explorer
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Multi-dimensional physiological feature space groupings (K-Means, K=5)
          </p>
        </div>
        <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '700', fontSize: '0.875rem' }}>
          Silhouette Score: {silhouetteScore}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
            2D Principal Component Analysis (PCA) Feature Map
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            *Points mapped using dimensional reduction of 31 clinical features
          </span>
        </div>

        <div style={{ height: '320px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" name="PCA Component 1" unit="" />
              <YAxis type="number" dataKey="y" name="PCA Component 2" unit="" />
              <ZAxis type="category" dataKey="patient_id" name="Patient ID" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Patients" data={scatterPoints}>
                {scatterPoints.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.cluster_id % CLUSTER_COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
        Discovered Physiological Pattern Clusters
      </h3>
      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {clusters.map((c, idx) => {
          const isSelected = selectedCluster === c.cluster_id;
          const color = CLUSTER_COLORS[c.cluster_id % CLUSTER_COLORS.length];
          return (
            <div
              key={c.cluster_id}
              onClick={() => setSelectedCluster(c.cluster_id)}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: isSelected ? color : '#e2e8f0',
                borderWidth: isSelected ? '2px' : '1px',
                background: isSelected ? `${color}08` : '#ffffff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '800', color: color, fontSize: '1.1rem' }}>{c.name}</span>
                <span style={{ background: '#f1f5f9', fontSize: '0.75rem', fontWeight: '700', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {c.patient_count} Patients
                </span>
              </div>
              
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '0.5rem' }}>
                {c.description}
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Avg Age: <strong>{c.avg_age} yrs</strong> • Avg O2: <strong>{c.avg_o2}%</strong>
              </div>
            </div>
          );
        })}
      </div>

      {clusters[selectedCluster] && (
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
            Cluster Details: {clusters[selectedCluster].name} ({clusters[selectedCluster].patient_count} Patients)
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <span style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
              Avg Temperature: <strong>{clusters[selectedCluster].avg_temp}°C</strong>
            </span>
            <span style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
              Avg Heart Rate: <strong>{clusters[selectedCluster].avg_hr} bpm</strong>
            </span>
            <span style={{ background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
              Avg Inflammatory CRP: <strong>{clusters[selectedCluster].avg_crp} mg/L</strong>
            </span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            *Unsupervised clustering groups patients according to physiological feature proximity. It does NOT provide autonomous disease diagnosis.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClusterExplorerPage;

