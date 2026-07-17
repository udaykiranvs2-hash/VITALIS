import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Toast from '../components/Toast.jsx';

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.profile?.fullName || user?.name || '',
    phone: user?.profile?.phone || '',
    birthDate: user?.profile?.birthDate || '',
    gender: user?.profile?.gender || 'female',
    bloodGroup: user?.profile?.bloodGroup || '',
    emergencyContact: user?.profile?.emergencyContact || '',
    insuranceProvider: user?.profile?.insuranceProvider || '',
    insuranceNumber: user?.profile?.insuranceNumber || '',
    preferredHospital: user?.profile?.preferredHospital || '',
    medicalConditions: (user?.profile?.medicalConditions || []).join(', '),
    allergies: (user?.profile?.allergies || []).join(', '),
    medications: (user?.profile?.medications || []).join(', '),
    familyHistory: (user?.profile?.familyHistory || []).join(', ')
  });
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setToast('');
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        birthDate: form.birthDate,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        emergencyContact: form.emergencyContact,
        insuranceProvider: form.insuranceProvider,
        insuranceNumber: form.insuranceNumber,
        preferredHospital: form.preferredHospital,
        medicalConditions: form.medicalConditions.split(',').map((item) => item.trim()).filter(Boolean),
        allergies: form.allergies.split(',').map((item) => item.trim()).filter(Boolean),
        medications: form.medications.split(',').map((item) => item.trim()).filter(Boolean),
        familyHistory: form.familyHistory.split(',').map((item) => item.trim()).filter(Boolean)
      };
      await updateProfile(payload);
      setToast('Profile updated successfully.');
    } catch {
      setToast('Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Profile settings</p>
          <h1>Update your health profile and emergency details.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <form className="feature-form" onSubmit={handleSubmit} aria-label="Profile update form">
        <div className="form-grid">
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Birth date
            <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
          </label>
          <label>
            Gender
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Blood group
            <input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
          </label>
          <label>
            Emergency contact
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} />
          </label>
          <label>
            Insurance provider
            <input name="insuranceProvider" value={form.insuranceProvider} onChange={handleChange} />
          </label>
          <label>
            Insurance number
            <input name="insuranceNumber" value={form.insuranceNumber} onChange={handleChange} />
          </label>
          <label className="full-width">
            Preferred hospital
            <input name="preferredHospital" value={form.preferredHospital} onChange={handleChange} />
          </label>
          <label className="full-width">
            Medical conditions
            <input name="medicalConditions" value={form.medicalConditions} onChange={handleChange} placeholder="Comma-separated" />
          </label>
          <label className="full-width">
            Allergies
            <input name="allergies" value={form.allergies} onChange={handleChange} placeholder="Comma-separated" />
          </label>
          <label className="full-width">
            Current medications
            <input name="medications" value={form.medications} onChange={handleChange} placeholder="Comma-separated" />
          </label>
          <label className="full-width">
            Family history
            <input name="familyHistory" value={form.familyHistory} onChange={handleChange} placeholder="Comma-separated" />
          </label>
        </div>
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Saving…' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
