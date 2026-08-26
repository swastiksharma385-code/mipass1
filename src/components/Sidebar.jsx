import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Activity, Home, Users, UserPlus, Network, 
  PieChart, Cpu, Settings, LogOut, Layers
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const links = [
    { to: '/', label: 'Home Landing', icon: Home },
    { to: '/dashboard', label: 'Doctor Dashboard', icon: Activity },
    { to: '/patients', label: 'Patient Directory', icon: Users },
    { to: '/add-patient', label: 'Add Patient', icon: UserPlus },
    { to: '/cluster-explorer', label: 'Cluster Explorer', icon: Layers },
    { to: '/analytics', label: 'ML Analytics', icon: PieChart },
    { to: '/simulation', label: 'Workflow Simulation', icon: Cpu },
    { to: '/settings', label: 'Settings & Disclaimers', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Network size={28} color="#38bdf8" />
        <div>
          <div className="sidebar-title">MEDCLUSTER AI</div>
          <div className="sidebar-subtitle">Clinical Decision Support</div>
        </div>
      </div>

      <nav style={{ flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ paddingTop: '1rem', borderTop: '1px solid #1e293b' }}>
        <button 
          onClick={onLogout}
          className="nav-item"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}
        >
          <LogOut size={18} />
          <span>Exit / Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

