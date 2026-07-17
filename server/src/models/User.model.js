import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, default: 'info' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const appointmentSchema = new mongoose.Schema({
  doctorId: String,
  doctorName: String,
  specialty: String,
  date: String,
  time: String,
  status: { type: String, default: 'confirmed' },
  createdAt: { type: Date, default: Date.now }
});

const reportSchema = new mongoose.Schema({
  title: String,
  type: String,
  fileName: String,
  uploadedAt: { type: Date, default: Date.now },
  summary: String,
  findings: [String],
  abnormalValues: [String],
  rawText: String,
  status: { type: String, default: 'analyzed' }
});

const symptomCheckSchema = new mongoose.Schema({
  symptoms: [String],
  duration: String,
  severity: String,
  medicalHistory: [String],
  allergies: [String],
  medications: [String],
  result: Object,
  checkedAt: { type: Date, default: Date.now }
});

const profileSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  birthDate: String,
  gender: String,
  bloodGroup: String,
  emergencyContact: String,
  insuranceProvider: String,
  insuranceNumber: String,
  preferredHospital: String,
  medicalConditions: [String],
  allergies: [String],
  medications: [String],
  familyHistory: [String]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
  profile: { type: profileSchema, default: {} },
  reports: { type: [reportSchema], default: [] },
  appointments: { type: [appointmentSchema], default: [] },
  notifications: { type: [notificationSchema], default: [] },
  history: { type: [symptomCheckSchema], default: [] },
  resetToken: String,
  resetTokenExpires: Date
}, { timestamps: true });

export default mongoose.model('User', userSchema);
