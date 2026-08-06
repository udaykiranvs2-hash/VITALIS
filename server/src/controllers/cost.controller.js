const hospitalMultipliers = {
  standard: 1,
  premium: 1.35,
  luxury: 1.75
};

const procedureBase = {
  'Appendectomy': 2800,
  'Knee Replacement': 9500,
  'Hip Replacement': 10500,
  'Gallbladder Surgery': 5400,
  'Hernia Repair': 3500,
  'Caesarean Delivery': 5500,
  'Angioplasty': 12000,
  'Cataract Surgery': 4200,
  'Heart Bypass': 22000,
  'General Consultation': 85,
  'MRI Scan': 620,
  'CT Scan': 520,
  'ECG': 120
};

export const estimateCost = (req, res) => {
  const { country, state, procedure, hospitalType, currency = 'INR', sector = 'Private' } = req.body;
  if (!country || !procedure || !hospitalType) {
    return res.status(400).json({ message: 'Country, procedure, and hospital type are required.' });
  }

  // Base cost is looked up, or fallback to generic 900 if typed manually
  const base = procedureBase[procedure] || 900;
  
  // Multipliers
  const typeMultiplier = hospitalMultipliers[hospitalType.toLowerCase()] || 1;
  const sectorMultiplier = sector.toLowerCase() === 'public' ? 0.4 : 1.0;
  
  const estimatedUsd = Math.round(base * typeMultiplier * sectorMultiplier);

  // Conversion rates (approximate, USD base)
  const rates = {
    'USD': 1,
    'INR': 83,
    'EUR': 0.92,
    'GBP': 0.79,
    'AUD': 1.53,
    'CAD': 1.36
  };
  const conversionRate = rates[currency] || 83; // fallback to INR

  const estimatedConverted = Math.round(estimatedUsd * conversionRate);
  const medicationCostConverted = Math.round(estimatedConverted * 0.12);
  const followUpCostConverted = Math.round(estimatedConverted * 0.08);
  const hospitalStay = hospitalType.toLowerCase() === 'luxury' ? '3-5 days' : '2-4 days';

  // Locale mapping for Intl.NumberFormat based on currency
  const locales = {
    'USD': 'en-US',
    'INR': 'en-IN',
    'EUR': 'de-DE',
    'GBP': 'en-GB',
    'AUD': 'en-AU',
    'CAD': 'en-CA'
  };
  const locale = locales[currency] || 'en-IN';

  const fmt = (v) => new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(v);

  return res.status(200).json({
    procedure,
    country,
    state,
    estimatedUsd,
    estimatedConverted,
    costRange: `${fmt(Math.round(estimatedConverted * 0.9))} - ${fmt(Math.round(estimatedConverted * 1.1))}`,
    hospitalStay,
    medicationCost: fmt(medicationCostConverted),
    medicationCostConverted,
    followUpCost: fmt(followUpCostConverted),
    followUpCostConverted,
    insuranceNote: 'Actual cost may vary by provider and insurance coverage. Verify with your insurer before booking.',
    disclaimer: 'This estimate is informational and not a guaranteed price quote.'
  });
};
