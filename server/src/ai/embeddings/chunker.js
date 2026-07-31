/**
 * Converts a structured disease object into meaningful text chunks suitable for vector search.
 * We split by logical domains (Symptoms, Causes, Treatments) but inject the disease name
 * into every chunk so the LLM and vector math understand the context.
 * 
 * @param {Object} disease - Validated disease object
 * @returns {Array<{diseaseId: string, type: string, text: string}>}
 */
export const chunkDisease = (disease) => {
  const chunks = [];
  const baseContext = `Disease: ${disease.name}${disease.aliases?.length ? ` (also known as ${disease.aliases.join(', ')})` : ''}.`;

  // Chunk 1: Symptoms and Overview
  if (disease.symptoms?.length) {
    chunks.push({
      diseaseId: disease.id,
      type: 'symptoms',
      text: `${baseContext} Symptoms include: ${disease.symptoms.join(', ')}.`
    });
  }

  // Chunk 2: Causes and Risks
  if (disease.causes?.length || disease.riskFactors?.length) {
    const causesText = disease.causes?.length ? `Causes: ${disease.causes.join(', ')}.` : '';
    const riskText = disease.riskFactors?.length ? `Risk Factors: ${disease.riskFactors.join(', ')}.` : '';
    chunks.push({
      diseaseId: disease.id,
      type: 'causes_risks',
      text: `${baseContext} ${causesText} ${riskText}`.trim()
    });
  }

  // Chunk 3: Treatments, Home Care, and Prevention
  if (disease.possibleTreatments?.length || disease.homeCare?.length || disease.prevention?.length) {
    const treatText = disease.possibleTreatments?.length ? `Treatments: ${disease.possibleTreatments.join(', ')}.` : '';
    const homeText = disease.homeCare?.length ? `Home Care: ${disease.homeCare.join(', ')}.` : '';
    const prevText = disease.prevention?.length ? `Prevention: ${disease.prevention.join(', ')}.` : '';
    chunks.push({
      diseaseId: disease.id,
      type: 'treatments_prevention',
      text: `${baseContext} ${treatText} ${homeText} ${prevText}`.trim()
    });
  }

  // Chunk 4: Medical specifics (Tests, Differentials, Red Flags, Complications)
  if (disease.recommendedTests?.length || disease.redFlags?.length || disease.complications?.length) {
    const testText = disease.recommendedTests?.length ? `Recommended Tests: ${disease.recommendedTests.join(', ')}.` : '';
    const redFlagText = disease.redFlags?.length ? `Red Flags / Emergencies: ${disease.redFlags.join(', ')}.` : '';
    const complicationsText = disease.complications?.length ? `Complications: ${disease.complications.join(', ')}.` : '';
    chunks.push({
      diseaseId: disease.id,
      type: 'medical_specifics',
      text: `${baseContext} ${testText} ${redFlagText} ${complicationsText}`.trim()
    });
  }

  return chunks;
};
