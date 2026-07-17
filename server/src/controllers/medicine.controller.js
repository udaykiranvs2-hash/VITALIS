import medicineData from '../data/medicineData.js';

export const searchMedicine = (req, res) => {
  const searchTerm = req.query.query || '';
  const results = medicineData.filter((medicine) =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.uses.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return res.status(200).json({ medicines: results });
};
