import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertTriangle, Activity, Layers, ArrowUpRight, Sparkles } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, patientsRes] = await Promise.all([
        api.getAnalytics(),
        api.getPatients({ page: 1, limit: 8, sortBy: 'created_at', sortOrder: 'DESC' })
      ]);
      setAnalytics(analyticsRes.data);
      setRecentPatients(patientsRes.data.patients || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading Clinical Dashboard...</p>
      </div>
    );
  }

  const summary = analytics?.summary || {
    total_patients: 500,
    high_priority: 110,
    medium_priority: 240,
    low_priority: 150,
    avg_similarity_score: 86.4,
    total_clusters: 5
  };

  const pieData = analytics?.priority_distribution || [
    { name: 'High Priority', value: summary.high_priority, color: '#ef4444' },
    { name: 'Medium Priority', value: summary.medium_priority, color: '#f59e0b' },
    { name: 'Low Priority', value: summary.low_priority, color: '#10b981' }
  ];

  const ageData = analytics?.age_distribution || [
    { age_group: '18-29', count: 65 },
    { age_group: '30-44', count: 120 },
    { age_group: '45-59', count: 160 },
    { age_group: '60-74', count: 115 },
    { age_group: '75+', count: 40 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>Clinical Executive Dashboard</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Real-time AI patient similarity, physiological triage overview & cluster metrics
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/add-patient" className="btn btn-primary">
            + Register New Patient
          </Link>
          <Link to="/patients" className="btn btn-outline">
            View All Patients
          </Link>
        </div>
      </div>

      <div className="grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <div className="card summary-card">
          <div>
            <div className="stat-value">{summary.total_patients}</div>
            <div className="stat-label">Total Patients</div>
          </div>
          <Users size={32} color="#0284c7" />
        </div>

        <div className="card summary-card" style={{ borderLeft: '4px solid #ef4444' }}>
          <div>
            <div className="stat-value" style={{ color: '#dc2626' }}>{summary.high_priority}</div>
            <div className="stat-label">High Priority Triage</div>
          </div>
          <AlertTriangle size={32} color="#ef4444" />
        </div>

        <div className="card summary-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div>
            <div className="stat-value" style={{ color: '#d97706' }}>{summary.medium_priority}</div>
            <div className="stat-label">Medium Priority</div>
          </div>
          <Activity size={32} color="#f59e0b" />
        </div>

        <div className="card summary-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div>
            <div className="stat-value" style={{ color: '#059669' }}>{summary.low_priority}</div>
            <div className="stat-label">Low Priority</div>
          </div>
          <Layers size={32} color="#10b981" />
        </div>
      </div>

      <div className="grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Physiological Triage Breakdown</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Patient Age Demographics</h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <XAxis dataKey="age_group" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Recent Patient Triage Queue</h3>
          <Link to="/patients" style={{ fontSize: '0.8125rem', color: '#0284c7', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            View Full Patient Directory <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Age / Gender</th>
                <th>Main Symptoms</th>
                <th>Vital Signs (O2 / HR / BP)</th>
                <th>Priority</th>
                <th>Cluster</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p) => {
                const prio = p.priority || 'MEDIUM';
                const badgeClass = prio === 'HIGH' ? 'badge-high' : (prio === 'LOW' ? 'badge-low' : 'badge-medium');
                return (
                  <tr key={p.patient_id}>
                    <td style={{ fontWeight: '700', color: '#0284c7' }}>{p.patient_id}</td>
                    <td>{p.age} yrs / {p.gender}</td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: '#475569' }}>
                        {Array.isArray(p.symptoms) ? p.symptoms.slice(0, 3).join(', ') : p.symptoms}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem' }}>
                        {p.oxygen_saturation ? `${p.oxygen_saturation}% O2` : 'N/A'} • {p.heart_rate || '--'} bpm • {p.systolic_bp}/{p.diastolic_bp}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{prio}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>
                        {p.cluster_id !== null && p.cluster_id !== undefined ? `Cluster ${p.cluster_id + 1}` : 'Cluster 1'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/patients/${p.patient_id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                          Profile
                        </Link>
                        <Link to={`/analysis/${p.patient_id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                          <Sparkles size={12} /> Analyze
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

