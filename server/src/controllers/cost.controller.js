const hospitalMultipliers = {
  standard: 1,
  premium: 1.35,
  luxury: 1.75
};

const procedureBase = {
  'Appendectomy': 2800,
  'Knee Replacement': 9500,
  'Hip Replacement': 10500,
  'Gallbladder Removal': 5400,
  'Cataract Surgery': 4200,
  'Heart Bypass': 22000,
  'General Consultation': 85,
  'MRI Scan': 620,
  'CT Scan': 520,
  'ECG': 120
};

export const estimateCost = (req, res) => {
  const { country, state, procedure, hospitalType } = req.body;
  if (!country || !procedure || !hospitalType) {
    return res.status(400).json({ message: 'Country, procedure, and hospital type are required.' });
  }

  const base = procedureBase[procedure] || 900;
  const multiplier = hospitalMultipliers[hospitalType.toLowerCase()] || 1;
  const estimated = Math.round(base * multiplier);
  const medicationCost = Math.round(estimated * 0.12);
  const followUpCost = Math.round(estimated * 0.08);
  const hospitalStay = hospitalType.toLowerCase() === 'luxury' ? '3-5 days' : '2-4 days';

  return res.status(200).json({
    procedure,
    country,
    state,
    costRange: `$${Math.round(estimated * 0.9)} - $${Math.round(estimated * 1.1)}`,
    hospitalStay,
    medicationCost: `$${medicationCost}`,
    followUpCost: `$${followUpCost}`,
    insuranceNote: 'Actual cost may vary by provider and insurance coverage. Verify with your insurer before booking.',
    disclaimer: 'This estimate is informational and not a guaranteed price quote.'
  });
};
