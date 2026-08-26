const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'doctor' && password === 'doctor123') {
    return res.json({
      success: true,
      token: 'demo-jwt-token-medcluster-2026',
      user: {
        id: 'DOC-9041',
        name: 'Dr. Sarah Jenkins, MD',
        role: 'Senior Attending Physician',
        department: 'Emergency & Acute Care',
        hospital: 'St. Jude Academic Medical Center'
      }
    });
  }
  
  return res.status(401).json({
    success: false,
    message: 'Invalid credentials. Use demo login: doctor / doctor123'
  });
});

module.exports = router;

