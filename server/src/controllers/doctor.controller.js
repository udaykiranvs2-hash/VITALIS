import doctorData from '../data/doctorData.js';

export const getDoctors = (req, res) => {
  const { specialty, location, language, minRating, maxFee, isOnline, isInClinic, sortBy } = req.query;
  let doctors = [...doctorData];

  if (specialty) {
    doctors = doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }
  if (location) {
    const locLower = location.toLowerCase();
    doctors = doctors.filter((doctor) => 
      doctor.city.toLowerCase().includes(locLower) || 
      doctor.state.toLowerCase().includes(locLower) || 
      doctor.area.toLowerCase().includes(locLower)
    );
  }
  if (language) {
    doctors = doctors.filter((doctor) => doctor.languages.some((lang) => lang.toLowerCase().includes(language.toLowerCase())));
  }
  if (minRating) {
    doctors = doctors.filter((doctor) => doctor.rating >= parseFloat(minRating));
  }
  if (maxFee) {
    doctors = doctors.filter((doctor) => doctor.fee <= parseFloat(maxFee));
  }
  if (isOnline === 'true') {
    doctors = doctors.filter((doctor) => doctor.isOnline);
  }
  if (isInClinic === 'true') {
    doctors = doctors.filter((doctor) => doctor.isInClinic);
  }

  if (sortBy === 'Rating') {
    doctors.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'Fee: Low to High') {
    doctors.sort((a, b) => a.fee - b.fee);
  } else if (sortBy === 'Fee: High to Low') {
    doctors.sort((a, b) => b.fee - a.fee);
  } else if (sortBy === 'Experience') {
    doctors.sort((a, b) => b.experience - a.experience);
  }

  // Fallback: if filters resulted in 0 doctors, show available doctors instead of nothing
  if (doctors.length === 0) {
    doctors = [...doctorData].filter(d => d.badge === 'Available Now' || d.rating >= 4.8);
  }

  return res.status(200).json({ doctors });
};

export const getDoctorById = (req, res) => {
  const doctor = doctorData.find((item) => item.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }
  return res.status(200).json({ doctor });
};
