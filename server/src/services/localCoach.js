const roleQuestionBank = [
  "Walk me through your background and why it fits this role.",
  "Tell me about a project from your resume that best shows your impact.",
  "Describe a difficult technical or product tradeoff you made.",
  "How do you debug an ambiguous problem under time pressure?",
  "Give an example of collaborating with someone who disagreed with your approach.",
  "What would you prioritize in your first 30 days in this role?"
];

const technicalPrompts = {
  frontend: "How would you design a performant, accessible user interface for a complex workflow?",
  backend: "How would you design a reliable API that handles validation, errors, and scale?",
  data: "How would you evaluate whether a model or analysis is trustworthy in production?",
  product: "How would you decide what to build when customer feedback and metrics disagree?"
};

function inferSpecialty(role) {
  const lower = role.toLowerCase();
  if (lower.includes("front") || lower.includes("react") || lower.includes("ui")) return "frontend";
  if (lower.includes("data") || lower.includes("ml") || lower.includes("ai")) return "data";
  if (lower.includes("product") || lower.includes("manager")) return "product";
  return "backend";
}

export function createLocalQuestion({ role, resumeText, history }) {
  const specialty = inferSpecialty(role);
  const currentTurn = history.length;

  if (currentTurn === 2) return technicalPrompts[specialty];

  const lastAnswer = history.at(-1)?.answer ?? "";
  if (lastAnswer.length > 0 && currentTurn % 2 === 1) {
    return `You mentioned ${lastAnswer.split(/\s+/).slice(0, 10).join(" ")}. Can you go deeper on your specific contribution, the outcome, and what you learned?`;
  }

  const resumeHint = resumeText.match(/\b(React|Node|Python|AWS|SQL|Java|TypeScript|lead|built|launched|optimized)\b/i)?.[0];
  const base = roleQuestionBank[currentTurn % roleQuestionBank.length];
  return resumeHint ? `${base} Please include how your ${resumeHint} experience applies.` : base;
}

export function createLocalEvaluation({ role, history }) {
  const totalWords = history.reduce((sum, item) => sum + item.answer.split(/\s+/).filter(Boolean).length, 0);
  const averageWords = totalWords / Math.max(history.length, 1);
  const hasMetrics = history.some((item) => /\d|percent|%|revenue|users|latency|cost/i.test(item.answer));
  const hasStructure = history.some((item) => /first|second|because|therefore|tradeoff|impact|result/i.test(item.answer));

  const communication = Math.min(95, Math.max(58, Math.round(averageWords * 0.8 + (hasStructure ? 20 : 8))));
  const technicalKnowledge = Math.min(94, 62 + (hasMetrics ? 12 : 0) + Math.min(20, history.length * 4));
  const confidence = Math.min(92, 60 + Math.round(averageWords / 6) + (history.length >= 5 ? 8 : 0));
  const problemSolving = Math.min(93, 61 + (hasStructure ? 14 : 4) + (hasMetrics ? 10 : 0));

  return {
    summary: `You showed a solid foundation for a ${role} interview. The strongest answers connected past work to business or user impact; the next jump is adding sharper structure, evidence, and decision-making detail in every response.`,
    scores: {
      communication,
      technicalKnowledge,
      confidence,
      problemSolving
    },
    strengths: [
      "Connected resume experience to the target role.",
      "Handled follow-up questions with useful context.",
      hasMetrics ? "Used measurable outcomes to support credibility." : "Identified relevant project experience."
    ],
    weaknesses: [
      "Some answers would benefit from a tighter situation-action-result structure.",
      "Add more concrete metrics, constraints, and alternatives considered.",
      "Practice concise opening sentences before adding detail."
    ],
    roadmap: [
      "Rewrite three resume projects into STAR stories with quantified outcomes.",
      "Practice two technical deep dives: architecture, tradeoffs, failure modes, and testing.",
      "Record a 20-minute mock interview and review filler words, pace, and answer length.",
      "Prepare role-specific examples for leadership, conflict, ambiguity, and execution."
    ]
  };
}
