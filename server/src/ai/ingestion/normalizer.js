/**
 * Normalizes medical terminology and text to ensure consistency across the knowledge base.
 */

/**
 * Normalizes a single string.
 * Lowercases and trims whitespace.
 * @param {string} text
 * @returns {string}
 */
export const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toLowerCase();
};

/**
 * Normalizes an array of strings, removing exact duplicates.
 * @param {string[]} list
 * @returns {string[]}
 */
export const normalizeList = (list) => {
  if (!Array.isArray(list)) return [];
  const normalized = list.map(normalizeText).filter(Boolean);
  return [...new Set(normalized)];
};

/**
 * Applies normalization to a raw disease object before validation.
 * @param {Object} rawData 
 * @returns {Object} Normalized data
 */
export const normalizeDiseaseData = (rawData) => {
  if (!rawData || typeof rawData !== 'object') return rawData;

  return {
    ...rawData,
    id: normalizeText(rawData.id),
    name: rawData.name?.trim(), // Keep original casing for display name
    aliases: normalizeList(rawData.aliases),
    symptoms: normalizeList(rawData.symptoms),
    causes: normalizeList(rawData.causes),
    riskFactors: normalizeList(rawData.riskFactors),
    complications: normalizeList(rawData.complications),
    differentialDiagnosis: normalizeList(rawData.differentialDiagnosis),
    recommendedTests: normalizeList(rawData.recommendedTests),
    possibleTreatments: normalizeList(rawData.possibleTreatments),
    homeCare: normalizeList(rawData.homeCare),
    prevention: normalizeList(rawData.prevention),
    redFlags: normalizeList(rawData.redFlags),
    specialist: rawData.specialist?.trim(),
    references: rawData.references?.map(r => r.trim()).filter(Boolean) || []
  };
};
