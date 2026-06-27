import { motion } from "framer-motion";
import { BrainCircuit, Send, Trophy } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Card } from "../components/Card.jsx";

export function InterviewPanel({ question, questionNumber, maxQuestions, answer, setAnswer, onSubmit, onEvaluate, loading, finished, transcript }) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-teal/10 p-2 text-teal">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal">Question {Math.min(questionNumber, maxQuestions)} of {maxQuestions}</p>
              <h2 className="text-xl font-bold text-foreground">Mock interview</h2>
            </div>
          </div>
          <div className="h-2 w-28 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-teal transition-all" style={{ width: `${(questionNumber / maxQuestions) * 100}%` }} />
          </div>
        </div>

        <motion.div key={question} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border bg-background/80 p-5 text-foreground">
          <p className="text-lg font-semibold leading-relaxed">{finished ? "Great work. Your interview is ready for evaluation." : question}</p>
        </motion.div>

        {!finished ? (
          <>
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Answer as if you were speaking to the interviewer..."
              className="mt-5 min-h-44 w-full resize-none rounded-xl border border-border bg-surface/70 p-4 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <div className="mt-4 flex justify-end">
              <Button loading={loading} disabled={answer.trim().length < 10} onClick={onSubmit}>
                <Send className="h-4 w-4" /> Submit answer
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-5 flex justify-end">
            <Button variant="accent" loading={loading} onClick={onEvaluate}>
              <Trophy className="h-4 w-4" /> Generate evaluation
            </Button>
          </div>
        )}
      </Card>

      <Card className="max-h-[620px] overflow-hidden p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">Transcript</h3>
        <div className="space-y-4 overflow-y-auto pr-1">
          {transcript.length === 0 && <p className="text-sm text-muted-foreground">Your answers will appear here as the interview progresses.</p>}
          {transcript.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-xl border border-border bg-surface/60 p-3">
              <p className="text-xs font-bold text-teal">Q{index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{item.question}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.section>
  );
}
