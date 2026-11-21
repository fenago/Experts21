// Deepgram Aura-2 English voices, from https://developers.deepgram.com/docs/tts-models
// (read 2026-11-21). Shared by the browser (voice picker) and the Netlify Functions
// (the speak function only accepts voices in this list).

export const VOICES = [
  { id: "aura-2-amalthea-en", name: "Amalthea", accent: "Filipino", traits: "Engaging, Natural, Cheerful" },
  { id: "aura-2-andromeda-en", name: "Andromeda", accent: "American", traits: "Casual, Expressive, Comfortable" },
  { id: "aura-2-apollo-en", name: "Apollo", accent: "American", traits: "Confident, Comfortable, Casual" },
  { id: "aura-2-arcas-en", name: "Arcas", accent: "American", traits: "Natural, Smooth, Clear, Comfortable" },
  { id: "aura-2-aries-en", name: "Aries", accent: "American", traits: "Warm, Energetic, Caring" },
  { id: "aura-2-asteria-en", name: "Asteria", accent: "American", traits: "Clear, Confident, Knowledgeable, Energetic" },
  { id: "aura-2-athena-en", name: "Athena", accent: "American", traits: "Calm, Smooth, Professional" },
  { id: "aura-2-atlas-en", name: "Atlas", accent: "American", traits: "Enthusiastic, Confident, Approachable, Friendly" },
  { id: "aura-2-aurora-en", name: "Aurora", accent: "American", traits: "Cheerful, Expressive, Energetic" },
  { id: "aura-2-callista-en", name: "Callista", accent: "American", traits: "Clear, Energetic, Professional, Smooth" },
  { id: "aura-2-cora-en", name: "Cora", accent: "American", traits: "Smooth, Melodic, Caring" },
  { id: "aura-2-cordelia-en", name: "Cordelia", accent: "American", traits: "Approachable, Warm, Polite" },
  { id: "aura-2-delia-en", name: "Delia", accent: "American", traits: "Casual, Friendly, Cheerful, Breathy" },
  { id: "aura-2-draco-en", name: "Draco", accent: "British", traits: "Warm, Approachable, Trustworthy, Baritone" },
  { id: "aura-2-electra-en", name: "Electra", accent: "American", traits: "Professional, Engaging, Knowledgeable" },
  { id: "aura-2-harmonia-en", name: "Harmonia", accent: "American", traits: "Empathetic, Clear, Calm, Confident" },
  { id: "aura-2-helena-en", name: "Helena", accent: "American", traits: "Caring, Natural, Positive, Friendly, Raspy" },
  { id: "aura-2-hera-en", name: "Hera", accent: "American", traits: "Smooth, Warm, Professional" },
  { id: "aura-2-hermes-en", name: "Hermes", accent: "American", traits: "Expressive, Engaging, Professional" },
  { id: "aura-2-hyperion-en", name: "Hyperion", accent: "Australian", traits: "Caring, Warm, Empathetic" },
  { id: "aura-2-iris-en", name: "Iris", accent: "American", traits: "Cheerful, Positive, Approachable" },
  { id: "aura-2-janus-en", name: "Janus", accent: "American", traits: "Southern, Smooth, Trustworthy" },
  { id: "aura-2-juno-en", name: "Juno", accent: "American", traits: "Natural, Engaging, Melodic, Breathy" },
  { id: "aura-2-jupiter-en", name: "Jupiter", accent: "American", traits: "Expressive, Knowledgeable, Baritone" },
  { id: "aura-2-luna-en", name: "Luna", accent: "American", traits: "Friendly, Natural, Engaging" },
  { id: "aura-2-mars-en", name: "Mars", accent: "American", traits: "Smooth, Patient, Trustworthy, Baritone" },
  { id: "aura-2-minerva-en", name: "Minerva", accent: "American", traits: "Positive, Friendly, Natural" },
  { id: "aura-2-neptune-en", name: "Neptune", accent: "American", traits: "Professional, Patient, Polite" },
  { id: "aura-2-odysseus-en", name: "Odysseus", accent: "American", traits: "Calm, Smooth, Comfortable, Professional" },
  { id: "aura-2-ophelia-en", name: "Ophelia", accent: "American", traits: "Expressive, Enthusiastic, Cheerful" },
  { id: "aura-2-orion-en", name: "Orion", accent: "American", traits: "Approachable, Comfortable, Calm, Polite" },
  { id: "aura-2-orpheus-en", name: "Orpheus", accent: "American", traits: "Professional, Clear, Confident, Trustworthy" },
  { id: "aura-2-pandora-en", name: "Pandora", accent: "British", traits: "Smooth, Calm, Melodic, Breathy" },
  { id: "aura-2-phoebe-en", name: "Phoebe", accent: "American", traits: "Energetic, Warm, Casual" },
  { id: "aura-2-pluto-en", name: "Pluto", accent: "American", traits: "Smooth, Calm, Empathetic, Baritone" },
  { id: "aura-2-saturn-en", name: "Saturn", accent: "American", traits: "Knowledgeable, Confident, Baritone" },
  { id: "aura-2-selene-en", name: "Selene", accent: "American", traits: "Expressive, Engaging, Energetic" },
  { id: "aura-2-thalia-en", name: "Thalia", accent: "American", traits: "Clear, Confident, Energetic, Enthusiastic" },
  { id: "aura-2-theia-en", name: "Theia", accent: "Australian", traits: "Expressive, Polite, Sincere" },
  { id: "aura-2-vesta-en", name: "Vesta", accent: "American", traits: "Natural, Expressive, Patient, Empathetic" },
  { id: "aura-2-zeus-en", name: "Zeus", accent: "American", traits: "Deep, Trustworthy, Smooth" },
];

export const VOICE_IDS = new Set(VOICES.map((v) => v.id));
export const FALLBACK_VOICE = "aura-2-thalia-en";

// Default voice per expert, chosen to fit each persona's voice and working style.
export const DEFAULT_VOICES = {
  orchestrator: "aura-2-athena-en", // Elena: calm, composed conductor
  "engagement-lead": "aura-2-orion-en", // Marcus: steady, approachable, calm
  "coffee-business-strategist": "aura-2-electra-en", // Isabel: crisp, knowledgeable
  "market-research-analyst": "aura-2-selene-en", // Priya: curious, engaging
  "latin-market-advisor": "aura-2-vesta-en", // Lourdes: warm, patient, expressive
  "competitive-intel-analyst": "aura-2-hermes-en", // Dante: quick, sharp
  "real-estate-advisor": "aura-2-saturn-en", // Victor: confident, deal-savvy
  "buildout-design-advisor": "aura-2-arcas-en", // Tomás: practical, plain-spoken
  "permitting-specialist": "aura-2-callista-en", // Gloria: precise, clear
  "food-safety-specialist": "aura-2-asteria-en", // Nadia: firm, clear, confident
  "business-attorney": "aura-2-hera-en", // Eleanor: careful, measured, professional
  "financial-modeling-analyst": "aura-2-neptune-en", // Daniel: patient, shows the math
  "funding-advisor": "aura-2-harmonia-en", // Grace: reassuring, calm, confident
  "accounting-tax-advisor": "aura-2-mars-en", // Walter: meticulous, patient
  "insurance-risk-manager": "aura-2-pluto-en", // Andrés: calm, prepared
  "head-of-coffee": "aura-2-aries-en", // Mateo: warm, passionate
  "menu-beverage-developer": "aura-2-ophelia-en", // Camila: playful, enthusiastic
  "operations-manager": "aura-2-phoebe-en", // Rosa: brisk, energetic
  "hr-talent-advisor": "aura-2-cordelia-en", // Jasmine: warm, encouraging
  "equipment-specialist": "aura-2-orpheus-en", // Kenji: clear, reliable
  "restaurant-tech-specialist": "aura-2-apollo-en", // Leo: pragmatic, casual
  "brand-creative-director": "aura-2-aurora-en", // Sofía: bold, expressive
  "digital-marketer": "aura-2-iris-en", // Zoe: upbeat, positive
  "community-pr-manager": "aura-2-atlas-en", // Theo: friendly connector
  "red-team-reviewer": "aura-2-zeus-en", // Frank: deep, direct skeptic
  "agent-builder": "aura-2-theia-en", // Ada: methodical, sincere
  "ui-designer-apple-liquid-glass": "aura-2-pandora-en", // Sable: calm, precise, melodic
  "ux-designer-apple-hig": "aura-2-helena-en", // Wren: warm, plain-spoken
};

export const voiceById = (id) => VOICES.find((v) => v.id === id);
export const defaultVoiceFor = (agent) => DEFAULT_VOICES[agent] || FALLBACK_VOICE;

// Deepgram's /v1/speak accepts at most 2000 characters per request (Aura-2).
export const SPEAK_MAX_CHARS = 2000;
