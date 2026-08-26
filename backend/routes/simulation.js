const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const {
    patientCount = 100,
    doctorCount = 5,
    avgReviewMinutes = 15,
    highPriorityPercent = 25
  } = req.body;

  const numPatients = Math.max(10, parseInt(patientCount, 10));
  const numDoctors = Math.max(1, parseInt(doctorCount, 10));
  const reviewTime = Math.max(5, parseInt(avgReviewMinutes, 10));
  const highPct = Math.max(5, Math.min(60, parseInt(highPriorityPercent, 10)));

  const highPriorityCount = Math.round((numPatients * highPct) / 100);
  const mediumPriorityCount = Math.round((numPatients * 45) / 100);
  const lowPriorityCount = numPatients - highPriorityCount - mediumPriorityCount;

  const totalDoctorWorkloadHours = (numPatients * reviewTime) / (60 * numDoctors);
  
  const stdAvgWaitHighPriorityHours = totalDoctorWorkloadHours / 2.2;
  const stdTimeFirstHighPriorityMinutes = (numPatients / numDoctors) * (reviewTime / 2);

  const aiAvgWaitHighPriorityHours = (highPriorityCount * reviewTime) / (60 * numDoctors * 2);
  const aiTimeFirstHighPriorityMinutes = reviewTime / numDoctors;

  const estimatedHighPriorityWaitReductionPct = Math.round(
    ((stdAvgWaitHighPriorityHours - aiAvgWaitHighPriorityHours) / stdAvgWaitHighPriorityHours) * 100
  );

  return res.json({
    parameters: {
      patientCount: numPatients,
      doctorCount: numDoctors,
      avgReviewMinutes: reviewTime,
      highPriorityPercent: highPct
    },
    breakdown: {
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
      totalShiftWorkloadHours: roundVal(totalDoctorWorkloadHours, 1)
    },
    standard_fcfs: {
      queue_type: "Standard First-Come-First-Serve (Unorganized)",
      avg_wait_high_priority_hours: roundVal(stdAvgWaitHighPriorityHours, 2),
      time_to_first_critical_review_mins: roundVal(stdTimeFirstHighPriorityMinutes, 1),
      risk_factor: "High - Critical cases wait in line behind non-urgent consultations"
    },
    ai_prioritized: {
      queue_type: "AI-Assisted Intelligent Priority Triage",
      avg_wait_high_priority_hours: roundVal(aiAvgWaitHighPriorityHours, 2),
      time_to_first_critical_review_mins: roundVal(aiTimeFirstHighPriorityMinutes, 1),
      estimated_high_priority_wait_reduction_pct: Math.max(0, estimatedHighPriorityWaitReductionPct),
      safety_benefit: "Instant clinical identification & prioritization of unstable vitals"
    },
    disclaimer: "Prototype Workflow Simulation based on mathematical queuing model assumptions. This simulation is provided for workflow organization concept evaluation and does NOT constitute a clinical study."
  });
});

function roundVal(val, decimals) {
  return parseFloat(Number(val).toFixed(decimals));
}

module.exports = router;

