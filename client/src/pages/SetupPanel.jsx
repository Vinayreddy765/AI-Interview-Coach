import { motion } from "framer-motion";
import { BriefcaseBusiness, Sparkles } from "lucide-react";
import { Button } from "../components/Button.jsx";
import { Card } from "../components/Card.jsx";
import { Dropzone } from "../components/Dropzone.jsx";

const roles = ["Frontend Engineer", "Backend Engineer", "AI Product Manager", "Data Scientist"];

export function SetupPanel({ file, setFile, role, setRole, onStart, loading, resumeMeta }) {
  return (
    <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-md bg-coral/10 p-2 text-coral">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Resume context</h2>
            <p className="text-sm text-muted-foreground">Upload once, then the coach adapts every question.</p>
          </div>
        </div>
        <Dropzone file={file} onFile={setFile} disabled={loading} />
        {resumeMeta && (
          <div className="mt-4 rounded-xl border border-border bg-surface/60 p-3 text-sm text-muted-foreground">
            Extracted {resumeMeta.wordCount} words from {resumeMeta.fileName}.
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-md bg-teal/10 p-2 text-teal">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Target role</h2>
            <p className="text-sm text-muted-foreground">Pick a preset or type the exact role.</p>
          </div>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          {roles.map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${role === item ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface/55 text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <input
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="e.g. Senior Full Stack Engineer"
          className="h-11 w-full rounded-xl border border-border bg-surface/70 px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
        <Button className="mt-5 w-full" loading={loading} onClick={onStart}>
          Start mock interview
        </Button>
      </Card>
    </motion.section>
  );
}
