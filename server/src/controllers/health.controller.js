import { findUserById } from '../utils/fallbackStore.js';
import { buildSymptomAssessment, analyzeReportDocument } from '../services/ai.service.js';


export const analyzeReport = async (req, res) => {
  let reportType = req.body?.reportType;
  let reportName = req.body?.reportName;
  let fileName = req.body?.fileName;
  let fileText = req.body?.fileText || '';

  if (req.file) {
    fileName = req.file.originalname;
    if (!reportName) {
      reportName = req.file.originalname;
    }
    if (req.file.buffer) {
      fileText = req.file.buffer.toString('utf-8');
    }
  }

  const analysis = await analyzeReportDocument({
    reportType: reportType || 'Lab Report',
    fileName: reportName || fileName || 'Uploaded report',
    rawText: fileText || ''
  });

  const user = await findUserById(req.userId);

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
  const user = await findUserById(req.userId);
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

  const user = await findUserById(req.userId);
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
  const user = await findUserById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const appointment = typeof user.appointments.id === 'function'
    ? user.appointments.id(appointmentId)
    : user.appointments.find((item) => String(item._id || item.id) === String(appointmentId));

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found.' });
  }

  appointment.status = 'cancelled';
  await user.save();

  return res.status(200).json({ message: 'Appointment cancelled successfully.' });
};
