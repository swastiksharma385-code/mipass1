import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Lock, User, AlertCircle } from 'lucide-react';
import api from '../services/api';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('doctor');
  const [password, setPassword] = useState('doctor123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ username, password });
      if (res.data.success) {
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try demo credentials: doctor / doctor123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Network size={36} color="#0284c7" style={{ marginBottom: '0.5rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a' }}>Doctor Login</h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>MedCluster AI Clinical Decision-Support Portal</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.65rem', borderRadius: '0.5rem', fontSize: '0.8125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <span className="loading-spinner"></span> : 'Login to Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
          <strong>College Prototype Demo Credentials:</strong><br />
          Username: <code>doctor</code><br />
          Password: <code>doctor123</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

