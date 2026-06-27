import { motion } from "framer-motion";
import { CheckCircle2, Map, TriangleAlert } from "lucide-react";
import { Card } from "../components/Card.jsx";
import { ScoreRing } from "../components/ScoreRing.jsx";

export function EvaluationPanel({ evaluation }) {
  const scores = evaluation?.scores ?? {};

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card className="p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-teal">Final evaluation</p>
        <h2 className="mt-2 text-2xl font-bold text-foreground">Interview readiness report</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">{evaluation.summary}</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ScoreRing label="Communication" value={scores.communication} />
        <ScoreRing label="Technical knowledge" value={scores.technicalKnowledge} />
        <ScoreRing label="Confidence" value={scores.confidence} />
        <ScoreRing label="Problem solving" value={scores.problemSolving} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <InsightList icon={<CheckCircle2 className="h-5 w-5" />} title="Strengths" items={evaluation.strengths} tone="text-teal bg-teal/10" />
        <InsightList icon={<TriangleAlert className="h-5 w-5" />} title="Weaknesses" items={evaluation.weaknesses} tone="text-coral bg-coral/10" />
        <InsightList icon={<Map className="h-5 w-5" />} title="Roadmap" items={evaluation.roadmap} tone="text-gold bg-gold/10" />
      </div>
    </motion.section>
  );
}

function InsightList({ icon, title, items = [], tone }) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className={`rounded-md p-2 ${tone}`}>{icon}</div>
        <h3 className="font-bold text-foreground">{title}</h3>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded-xl border border-border bg-surface/60 p-3 text-sm leading-6 text-muted-foreground">{item}</li>
        ))}
      </ul>
    </Card>
  );
}
