/**
 * Hardcoded, high-performance rule engine that intercepts potentially life-threatening 
 * symptoms before any LLM processing occurs. This guarantees immediate, reliable 
 * emergency guidance without relying on external API latency or hallucinations.
 */
export class EmergencyEngine {
  /**
   * Evaluates if the symptoms and patient profile indicate a severe emergency.
   * 
   * @param {string[]} symptoms
   * @param {Object} profile
   * @returns {Promise<{isEmergency: boolean, reason?: string, immediateAction?: string}>}
   */
  async evaluate(symptoms, profile = {}) {
    if (!symptoms || symptoms.length === 0) return { isEmergency: false };

    // Normalize all symptoms into a single searchable string
    const text = symptoms.join(' ').toLowerCase();

    // 1. Infant high fever check (High priority age-based rule)
    if (profile.age !== undefined && parseFloat(profile.age) <= 1 && text.includes('fever')) {
      return {
        isEmergency: true,
        reason: 'Fever in an infant under 1 year old',
        immediateAction: 'Go to the emergency room or contact a pediatrician immediately.'
      };
    }

    // 2. Keyword/Regex Rule Sets
    const emergencyRules = [
      {
        // Potential Cardiac Event
        keywords: ['chest pain', 'shortness of breath', 'left arm pain', 'jaw pain', 'crushing chest'],
        threshold: 2, // Needs at least 2 matching concepts to trigger (or 1 strong one, mapped below)
        reason: 'Potential Cardiac Event (e.g. Heart Attack)',
        action: 'Call 911 or your local emergency number immediately.'
      },
      {
        // Strong Cardiac single-triggers
        keywords: ['crushing chest pain', 'chest pain radiating'],
        threshold: 1,
        reason: 'Severe Cardiac Symptoms',
        action: 'Call 911 or go to the nearest emergency room immediately.'
      },
      {
        // Potential Stroke (FAST)
        keywords: ['face drooping', 'arm weakness', 'slurred speech', 'speech difficulty', 'sudden numbness'],
        threshold: 2,
        reason: 'Potential Stroke',
        action: 'Call 911 immediately. Time is critical for stroke treatment.'
      },
      {
        // Anaphylaxis / Respiratory Distress
        keywords: ['throat swelling', 'trouble breathing', 'can\'t breathe', 'blue lips', 'anaphylaxis', 'severe allergic reaction'],
        threshold: 1,
        reason: 'Severe Respiratory Distress or Anaphylaxis',
        action: 'Use an epinephrine auto-injector (EpiPen) if available and call 911 immediately.'
      },
      {
        // Loss of Consciousness
        keywords: ['unconscious', 'passed out', 'loss of consciousness', 'fainted and won\'t wake up'],
        threshold: 1,
        reason: 'Loss of Consciousness',
        action: 'Call 911 and seek immediate emergency medical attention.'
      }
    ];

    for (const rule of emergencyRules) {
      let matchCount = 0;
      for (const keyword of rule.keywords) {
        if (text.includes(keyword)) {
          matchCount++;
        }
      }

      if (matchCount >= rule.threshold) {
        return {
          isEmergency: true,
          reason: rule.reason,
          immediateAction: rule.action
        };
      }
    }

    // No emergency rules triggered
    return { isEmergency: false };
  }
}
