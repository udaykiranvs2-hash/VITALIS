/**
 * Validates a disease object against the standard AI Knowledge schema.
 * Throws an Error with detailed information if validation fails.
 * 
 * @param {Object} data - The disease object to validate
 * @returns {Object} The validated and normalized disease object
 */
export const validateDisease = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Disease data must be an object.');
  }

  const requiredString = (key, val) => {
    if (typeof val !== 'string' || val.trim() === '') {
      throw new Error(`Field '${key}' is required and must be a non-empty string.`);
    }
    return val.trim();
  };

  const requiredArray = (key, val) => {
    if (!Array.isArray(val)) {
      throw new Error(`Field '${key}' is required and must be an array.`);
    }
    return val.filter(item => typeof item === 'string' && item.trim() !== '').map(item => item.trim());
  };

  const optionalArray = (key, val) => {
    if (val === undefined || val === null) return [];
    if (!Array.isArray(val)) {
      throw new Error(`Field '${key}' must be an array if provided.`);
    }
    return val.filter(item => typeof item === 'string' && item.trim() !== '').map(item => item.trim());
  };

  const optionalString = (key, val) => {
    if (val === undefined || val === null) return '';
    if (typeof val !== 'string') {
      throw new Error(`Field '${key}' must be a string if provided.`);
    }
    return val.trim();
  };

  return {
    id: requiredString('id', data.id),
    name: requiredString('name', data.name),
    aliases: optionalArray('aliases', data.aliases),
    symptoms: requiredArray('symptoms', data.symptoms),
    causes: optionalArray('causes', data.causes),
    riskFactors: optionalArray('riskFactors', data.riskFactors),
    complications: optionalArray('complications', data.complications),
    differentialDiagnosis: optionalArray('differentialDiagnosis', data.differentialDiagnosis),
    recommendedTests: optionalArray('recommendedTests', data.recommendedTests),
    possibleTreatments: optionalArray('possibleTreatments', data.possibleTreatments),
    homeCare: optionalArray('homeCare', data.homeCare),
    prevention: optionalArray('prevention', data.prevention),
    redFlags: optionalArray('redFlags', data.redFlags),
    specialist: optionalString('specialist', data.specialist),
    references: optionalArray('references', data.references)
  };
};

/**
 * Creates an empty disease template matching the schema.
 * Useful for building new entities programmatically.
 */
export const createDiseaseTemplate = () => ({
  id: '',
  name: '',
  aliases: [],
  symptoms: [],
  causes: [],
  riskFactors: [],
  complications: [],
  differentialDiagnosis: [],
  recommendedTests: [],
  possibleTreatments: [],
  homeCare: [],
  prevention: [],
  redFlags: [],
  specialist: '',
  references: []
});
