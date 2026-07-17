import doctorData from '../data/doctorData.js';

export const getDoctors = (req, res) => {
  const { specialty, country, state, language, minRating, maxFee } = req.query;
  let doctors = [...doctorData];

  if (specialty) {
    doctors = doctors.filter((doctor) => doctor.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }
  if (country) {
    doctors = doctors.filter((doctor) => doctor.country.toLowerCase() === country.toLowerCase());
  }
  if (state) {
    doctors = doctors.filter((doctor) => doctor.state.toLowerCase() === state.toLowerCase());
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

  return res.status(200).json({ doctors });
};

export const getDoctorById = (req, res) => {
  const doctor = doctorData.find((item) => item.id === req.params.id);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found.' });
  }
  return res.status(200).json({ doctor });
};
