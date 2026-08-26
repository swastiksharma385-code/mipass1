import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientsPage from './pages/PatientsPage';
import AddPatientPage from './pages/AddPatientPage';
import PatientDetailsPage from './pages/PatientDetailsPage';
import PatientAnalysisPage from './pages/PatientAnalysisPage';
import SimilarPatientsPage from './pages/SimilarPatientsPage';
import ClusterExplorerPage from './pages/ClusterExplorerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkflowSimulationPage from './pages/WorkflowSimulationPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 'DOC-9041',
    name: 'Dr. Sarah Jenkins, MD',
    role: 'Senior Attending Physician'
  });

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar currentUser={currentUser} />
        
        <div className="main-layout">
          <Sidebar onLogout={handleLogout} />
          
          <main className="content-area">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage onLoginSuccess={setCurrentUser} />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/add-patient" element={<AddPatientPage />} />
              <Route path="/patients/:id" element={<PatientDetailsPage />} />
              <Route path="/analysis/:id" element={<PatientAnalysisPage />} />
              <Route path="/similar/:id" element={<SimilarPatientsPage />} />
              <Route path="/cluster-explorer" element={<ClusterExplorerPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/simulation" element={<WorkflowSimulationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
