import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowRight, BarChart3, Bot, Brain, CheckCircle2, Clock, Compass, FileText, MessageSquare, Plus, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./components/Button.jsx";
import { EvaluationPanel } from "./pages/EvaluationPanel.jsx";
import { InterviewPanel } from "./pages/InterviewPanel.jsx";
import { SetupPanel } from "./pages/SetupPanel.jsx";
import { evaluateInterview, getApiError, startInterview, submitAnswer, uploadResume } from "./lib/api.js";

const initialState = {
  step: "setup",
  resumeText: "",
  resumeMeta: null,
  sessionId: "",
  question: "",
  questionNumber: 1,
  maxQuestions: 5,
  transcript: [],
  evaluation: null,
  targetRole: "",
  createdAt: ""
};

const features = [
  {
    icon: FileText,
    title: "Upload your resume",
    desc: "PDF or DOCX. We extract your experience so questions feel personal."
  },
  {
    icon: MessageSquare,
    title: "Adaptive conversation",
    desc: "One question at a time, with follow-ups that build on what you said."
  },
  {
    icon: BarChart3,
    title: "Scored evaluation",
    desc: "Communication, technical depth, confidence, and problem-solving."
  },
  {
    icon: Compass,
    title: "Personalized roadmap",
    desc: "A focused study plan with topics and resources tailored to you."
  }
];

export default function App() {
  const [state, setState] = useState({ ...initialState, step: "landing" });
  const [interviewHistory, setInterviewHistory] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem("coach_interviews") || "[]");
    } catch {
      return [];
    }
  });
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("Frontend Engineer");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    if (!file) return setError("Upload a PDF or DOCX resume first.");
    if (role.trim().length < 2) return setError("Choose a target role.");

    setLoading(true);
    setError("");
    try {
      const parsed = await uploadResume(file);
      const session = await startInterview({ role, resumeText: parsed.text, maxQuestions: 5 });
      setState({
        ...initialState,
        step: "interview",
        resumeText: parsed.text,
        resumeMeta: parsed,
        sessionId: session.sessionId,
        question: session.question,
        questionNumber: session.questionNumber,
        maxQuestions: session.maxQuestions,
        targetRole: role,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    setLoading(true);
    setError("");
    try {
      const currentAnswer = answer.trim();
      const currentQuestion = state.question;
      const response = await submitAnswer(state.sessionId, { answer: currentAnswer, question: currentQuestion });
      const nextTranscript = [...state.transcript, { question: currentQuestion, answer: currentAnswer }];
      setAnswer("");
      setState((previous) => ({
        ...previous,
        transcript: nextTranscript,
        question: response.question || previous.question,
        questionNumber: response.questionNumber || previous.questionNumber,
        step: response.finished ? "interview" : "interview",
        finished: response.finished
      }));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleEvaluate() {
    setLoading(true);
    setError("");
    try {
      const evaluation = await evaluateInterview(state.sessionId);
      const completedInterview = {
        id: state.sessionId,
        role: state.targetRole || role,
        difficulty: "Adaptive",
        status: "completed",
        created_at: state.createdAt || new Date().toISOString(),
        completed_at: new Date().toISOString(),
        evaluation,
        transcript: state.transcript
      };
      setInterviewHistory((previous) => {
        const next = [completedInterview, ...previous.filter((item) => item.id !== completedInterview.id)].slice(0, 12);
        window.localStorage.setItem("coach_interviews", JSON.stringify(next));
        return next;
      });
      setState((previous) => ({ ...previous, step: "evaluation", evaluation }));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setState({ ...initialState, step: "landing" });
    setFile(null);
    setAnswer("");
    setError("");
  }

  return (
    <main className="min-h-screen text-foreground">
      <SiteNav
        onReset={reset}
        onStart={() => setState((previous) => ({ ...previous, step: "setup" }))}
        onDashboard={() => setState((previous) => ({ ...previous, step: "dashboard" }))}
        showReset={state.step !== "landing"}
        hasHistory={interviewHistory.length > 0}
      />

      {state.step === "landing" && <Landing onStart={() => setState((previous) => ({ ...previous, step: "setup" }))} />}

      {state.step !== "landing" && (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {state.step !== "dashboard" && (
        <header className="glass flex flex-col gap-4 rounded-2xl p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary">AI Interview Coach</p>
              <h1 className="text-2xl font-black tracking-normal text-foreground sm:text-3xl">Practice with resume-aware interview intelligence</h1>
            </div>
          </div>
          <Button variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </header>
        )}

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 rounded-lg border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
              <AlertCircle className="h-5 w-5 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {state.step === "dashboard" && (
          <Dashboard
            interviews={interviewHistory}
            onNew={() => setState((previous) => ({ ...previous, step: "setup" }))}
            onOpen={(interview) =>
              setState((previous) => ({
                ...previous,
                step: "evaluation",
                sessionId: interview.id,
                targetRole: interview.role,
                transcript: interview.transcript || [],
                evaluation: interview.evaluation
              }))
            }
          />
        )}

        {state.step === "setup" && (
          <SetupPanel
            file={file}
            setFile={setFile}
            role={role}
            setRole={setRole}
            onStart={handleStart}
            loading={loading}
            resumeMeta={state.resumeMeta}
          />
        )}

        {state.step === "interview" && (
          <InterviewPanel
            question={state.question}
            questionNumber={state.questionNumber}
            maxQuestions={state.maxQuestions}
            answer={answer}
            setAnswer={setAnswer}
            onSubmit={handleSubmitAnswer}
            onEvaluate={handleEvaluate}
            loading={loading}
            finished={state.finished}
            transcript={state.transcript}
          />
        )}

        {state.step === "evaluation" && <EvaluationPanel evaluation={state.evaluation} />}
      </div>
      )}
    </main>
  );
}

function SiteNav({ onReset, onStart, onDashboard, showReset, hasHistory }) {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={onReset} className="flex items-center gap-3 text-left">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:rotate-6">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold text-foreground">Coach</span>
        </button>
        <nav className="flex items-center gap-2">
          {hasHistory && (
            <Button variant="ghost" size="sm" onClick={onDashboard}>Dashboard</Button>
          )}
          {showReset ? (
            <>
              <Button size="sm" onClick={onStart}>
                <Plus className="h-4 w-4" /> New interview
              </Button>
              <Button variant="ghost" size="sm" onClick={onReset} title="Start over">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={onStart}>Sign in</Button>
          )}
        </nav>
      </div>
    </header>
  );
}

function Landing({ onStart }) {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground"
        >
          <Brain className="h-3.5 w-3.5 text-primary" />
         AI mock interviews that adapt to your resume and give you actionable feedback.
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-6 text-5xl font-bold tracking-tight md:text-7xl"
        >
          Interviews that <span className="gradient-text">prepare you</span>,
          <br className="hidden md:inline" /> not just test you.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          Upload your resume, choose a role, and run a realistic AI-led mock interview.
          Get a detailed scorecard and a roadmap to fix what matters.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-3"
        >
          <Button size="lg" onClick={onStart}>
            Start free <ArrowRight className="h-4 w-4" />
          </Button>
          <a href="#how-it-works">
            <Button size="lg" variant="ghost">
              How it works
            </Button>
          </a>
        </motion.div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="glass rounded-2xl p-6"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="glass rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            The hardest part is getting started.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Your first interview takes 10 minutes. The feedback lasts a lot longer.
          </p>
          <Button size="lg" className="mt-6" onClick={onStart}>
            Create your free account
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Built with care - AI mock interviews
      </footer>
    </>
  );
}

function Dashboard({ interviews, onNew, onOpen }) {
  return (
    <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-5xl px-0 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Your interviews</h1>
          <p className="mt-1 text-muted-foreground">Review past sessions or start a new one.</p>
        </div>
        <Button onClick={onNew} size="lg">
          <Plus className="h-4 w-4" /> New interview
        </Button>
      </div>

      <div className="mt-10">
        {interviews.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-12 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Your first interview is one click away</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Upload your resume, pick a role, and let Coach run a realistic mock interview.
            </p>
            <Button size="lg" className="mt-6" onClick={onNew}>Start your first interview</Button>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            {interviews.map((interview, index) => (
              <motion.button
                key={interview.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => onOpen(interview)}
                className="group glass flex items-center justify-between rounded-2xl p-5 text-left transition hover:border-primary/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-lg font-semibold text-foreground">{interview.role}</span>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {interview.difficulty}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1 text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatRelativeDate(interview.created_at)}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  );
}

function formatRelativeDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
