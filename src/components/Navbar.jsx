import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const Navbar = ({ currentUser }) => {
  return (
    <header>
      <div className="disclaimer-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={16} />
          <span>
            <strong>RESEARCH PROTOTYPE NOTICE:</strong> MedCluster AI outputs are for decision support only. 
            Does NOT perform autonomous medical diagnosis, treatment, or prescription.
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>College / Academic Prototype</span>
      </div>
      
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="#0284c7" />
          <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a' }}>
            St. Jude Academic Medical Center — Clinical Decision Support Unit
          </span>
        </div>

        <div className="navbar-user">
          <div className="user-avatar">
            {currentUser ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SJ'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {currentUser ? currentUser.name : 'Dr. Sarah Jenkins, MD'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {currentUser ? currentUser.role : 'Attending Physician'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

