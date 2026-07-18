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
  const estimatedUsd = Math.round(base * multiplier);

  // Convert to INR for display. Use a fixed conversion rate (USD -> INR).
  const conversionRate = 82; // 1 USD = 82 INR (approx)
  const estimatedInr = Math.round(estimatedUsd * conversionRate);
  const medicationCostInr = Math.round(estimatedInr * 0.12);
  const followUpCostInr = Math.round(estimatedInr * 0.08);
  const hospitalStay = hospitalType.toLowerCase() === 'luxury' ? '3-5 days' : '2-4 days';

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v);

  return res.status(200).json({
    procedure,
    country,
    state,
    estimatedUsd,
    estimatedInr,
    costRange: `${fmt(Math.round(estimatedInr * 0.9))} - ${fmt(Math.round(estimatedInr * 1.1))}`,
    hospitalStay,
    medicationCost: fmt(medicationCostInr),
    medicationCostInr,
    followUpCost: fmt(followUpCostInr),
    followUpCostInr,
    insuranceNote: 'Actual cost may vary by provider and insurance coverage. Verify with your insurer before booking.',
    disclaimer: 'This estimate is informational and not a guaranteed price quote.'
  });
};
