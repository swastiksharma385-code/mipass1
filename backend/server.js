const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const seedDatabase = require('./seed');

const authRoutes = require('./routes/auth');
const patientsRoutes = require('./routes/patients');
const analysisRoutes = require('./routes/analysis');
const clustersRoutes = require('./routes/clusters');
const analyticsRoutes = require('./routes/analytics');
const simulationRoutes = require('./routes/simulation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MedCluster AI Backend Service',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/patients', analysisRoutes);
app.use('/api/clusters', clustersRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/simulation', simulationRoutes);

// Serve Production React Frontend (dist)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA Fallback: Any non-API route serves index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Initialize database seed check and start server
db.get('SELECT COUNT(*) as count FROM patients', [], (err, row) => {
  if (err || !row || row.count === 0) {
    console.log('[INFO] Database empty or missing. Triggering seed script...');
    try {
      seedDatabase();
    } catch (e) {
      console.warn('[SEED WARN] Auto-seed error:', e.message);
    }
  } else {
    console.log(`[INFO] Database ready with ${row.count} patient records.`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===================================================`);
    console.log(` MEDCLUSTER AI Unified App Server running on port ${PORT}`);
    console.log(` Web App URL: http://localhost:${PORT}`);
    console.log(`===================================================`);
  });
});

