import User from '../models/User.model.js';
import { buildSymptomAssessment, analyzeReportDocument } from '../services/ai.service.js';

export const checkSymptoms = async (req, res) => {
  const { age, gender, symptoms, duration, severity, medicalHistory, allergies, medications } = req.body;
  const assessment = buildSymptomAssessment({ age, gender, symptoms, duration, severity, medicalHistory, allergies, medications });
  const user = await User.findById(req.userId);

  if (user) {
    user.history.unshift({
      symptoms,
      duration,
      severity,
      medicalHistory,
      allergies,
      medications,
      result: assessment
    });
    user.notifications.push({
      message: 'Your symptom check is complete. Review the results on your dashboard.',
      type: 'health'
    });
    await user.save();
  }

  return res.status(200).json(assessment);
};

export const analyzeReport = async (req, res) => {
  const { reportType, reportName, fileName, fileText } = req.body;
  const analysis = analyzeReportDocument({ reportType, fileName: reportName || fileName || 'Uploaded report', rawText: fileText || '' });
  const user = await User.findById(req.userId);

  if (user) {
    user.reports.unshift({
      title: analysis.title,
      type: reportType || 'Lab Report',
      fileName: fileName || reportName || 'health-report',
      summary: analysis.summary,
      findings: analysis.findings,
      abnormalValues: analysis.abnormalValues,
      rawText: fileText || ''
    });
    user.notifications.push({
      message: 'Your report analysis is ready in Health History.',
      type: 'report'
    });
    await user.save();
  }

  return res.status(200).json(analysis);
};

export const getHistory = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.status(200).json({ reports: user.reports, appointments: user.appointments, history: user.history });
};

export const bookAppointment = async (req, res) => {
  const { doctorId, doctorName, specialty, date, time } = req.body;
  if (!doctorId || !doctorName || !date || !time) {
    return res.status(400).json({ message: 'Doctor, date, and time are required to book an appointment.' });
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  user.appointments.unshift({ doctorId, doctorName, specialty, date, time, status: 'confirmed' });
  user.notifications.push({
    message: `Appointment booked with ${doctorName} on ${date} at ${time}.`,
    type: 'appointment'
  });
  await user.save();

  return res.status(201).json({ message: 'Appointment booked successfully.', appointment: user.appointments[0] });
};

export const cancelAppointment = async (req, res) => {
  const appointmentId = req.params.id;
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const appointment = user.appointments.id(appointmentId);
  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  appointment.status = 'cancelled';
  await user.save();

  return res.status(200).json({ message: 'Appointment cancelled successfully.' });
};
