import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Sparkles, ChevronLeft, ChevronRight, UserPlus, Eye, Network } from 'lucide-react';
import api from '../services/api';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('');
  const [gender, setGender] = useState('');
  const [symptom, setSymptom] = useState('');
  const [clusterId, setClusterId] = useState('');
  const [sortBy, setSortBy] = useState('patient_id');

  useEffect(() => {
    fetchPatients();
  }, [page, priority, gender, symptom, clusterId, sortBy]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients({
        search,
        priority,
        gender,
        symptom,
        clusterId,
        sortBy,
        page,
        limit: 12
      });
      setPatients(res.data.patients || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPatients();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a' }}>Patient Directory</h1>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Filter, search, and manage clinical patient cohorts ({total} records total)
          </p>
        </div>
        <Link to="/add-patient" className="btn btn-primary">
          <UserPlus size={16} /> Add New Patient
        </Link>
      </div>

      <div className="card" style={{ padding: '1rem', marginBottom: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search Patient ID or Symptoms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="select-field" style={{ width: '140px' }} value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
            <option value="">All Priorities</option>
            <option value="HIGH">HIGH Priority</option>
            <option value="MEDIUM">MEDIUM Priority</option>
            <option value="LOW">LOW Priority</option>
          </select>

          <select className="select-field" style={{ width: '130px' }} value={gender} onChange={(e) => { setGender(e.target.value); setPage(1); }}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select className="select-field" style={{ width: '150px' }} value={symptom} onChange={(e) => { setSymptom(e.target.value); setPage(1); }}>
            <option value="">All Symptoms</option>
            <option value="Fever">Fever</option>
            <option value="Cough">Cough</option>
            <option value="Breathlessness">Breathlessness</option>
            <option value="Chest pain">Chest Pain</option>
            <option value="Fatigue">Fatigue</option>
            <option value="Abdominal pain">Abdominal Pain</option>
          </select>

          <select className="select-field" style={{ width: '130px' }} value={clusterId} onChange={(e) => { setClusterId(e.target.value); setPage(1); }}>
            <option value="">All Clusters</option>
            <option value="0">Cluster 1</option>
            <option value="1">Cluster 2</option>
            <option value="2">Cluster 3</option>
            <option value="3">Cluster 4</option>
            <option value="4">Cluster 5</option>
          </select>

          <button type="submit" className="btn btn-outline">
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Loading Patients...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Age / Gender</th>
                  <th>Primary Symptoms</th>
                  <th>Vitals Baseline</th>
                  <th>Data Quality</th>
                  <th>Priority</th>
                  <th>Cluster</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => {
                  const prio = p.priority || 'MEDIUM';
                  const badgeClass = prio === 'HIGH' ? 'badge-high' : (prio === 'LOW' ? 'badge-low' : 'badge-medium');
                  const dqStatus = p.data_quality_status || 'GOOD';
                  const dqColor = dqStatus === 'GOOD' ? '#10b981' : (dqStatus === 'MODERATE' ? '#f59e0b' : '#ef4444');

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
                          {p.oxygen_saturation ? `${p.oxygen_saturation}% O2` : 'N/A'} • {p.heart_rate || '--'} bpm
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: dqColor, background: `${dqColor}15`, padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {dqStatus} ({p.data_quality_score || 95}%)
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${badgeClass}`}>{prio}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: '600', fontSize: '0.8125rem' }}>
                          {p.cluster_id !== null && p.cluster_id !== undefined ? `Cluster ${p.cluster_id + 1}` : 'Cluster 1'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <Link to={`/patients/${p.patient_id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            <Eye size={12} /> View
                          </Link>
                          <Link to={`/analysis/${p.patient_id}`} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            <Sparkles size={12} /> Analyze
                          </Link>
                          <Link to={`/similar/${p.patient_id}`} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                            <Network size={12} /> Similar
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Page {page} of {totalPages} ({total} patients)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;

