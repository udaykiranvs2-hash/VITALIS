import { useEffect, useState } from 'react';
import { getDoctors, bookAppointment } from '../api/api.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

const defaultFilters = {
  specialty: '',
  state: '',
  language: '',
  maxFee: ''
};

function DoctorDirectoryPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const response = await getDoctors(filters);
        setDoctors(response.data.doctors);
      } catch {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, [filters]);

  const handleBook = async (doctor, slot) => {
    setToast('');
    try {
      await bookAppointment({ doctorId: doctor.id, doctorName: doctor.name, specialty: doctor.specialty, date: slot.split(' ')[0], time: slot.split(' ')[1] });
      setToast(`Booked ${doctor.name} for ${slot}.`);
    } catch {
      setToast('Unable to book this appointment.');
    }
  };

  const handleChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  return (
    <div className="feature-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Doctor directory</p>
          <h1>Find specialists by skill, location and fee.</h1>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
      <div className="filter-panel">
        <label>
          Specialty
          <input name="specialty" value={filters.specialty} onChange={handleChange} placeholder="e.g. Cardiology" />
        </label>
        <label>
          State
          <input name="state" value={filters.state} onChange={handleChange} placeholder="e.g. Karnataka" />
        </label>
        <label>
          Language
          <input name="language" value={filters.language} onChange={handleChange} placeholder="e.g. English" />
        </label>
        <label>
          Max fee
          <input name="maxFee" type="number" value={filters.maxFee} onChange={handleChange} placeholder="USD" />
        </label>
      </div>
      {loading ? (
        <Loader label="Loading doctors…" />
      ) : doctors.length ? (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <article key={doctor.id} className="doctor-card">
              <img src={doctor.photo} alt={`Photo of ${doctor.name}`} />
              <div className="doctor-body">
                <h3>{doctor.name}</h3>
                <p className="muted">{doctor.specialty} • {doctor.experience} yrs</p>
                <p>{doctor.bio}</p>
                <div className="doctor-meta">
                  <span>Rating {doctor.rating}</span>
                  <span>${doctor.fee}</span>
                </div>
                <div className="slot-list">
                  {doctor.availableSlots.slice(0, 3).map((slot) => (
                    <button key={slot} type="button" className="secondary-button" onClick={() => handleBook(doctor, slot)}>
                      Book {slot}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">No doctors match the selected filters. Try different criteria.</p>
      )}
    </div>
  );
}

export default DoctorDirectoryPage;
