import { FileUp, X } from "lucide-react";

export function Dropzone({ file, onFile, disabled }) {
  return (
    <label className={`group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/55 p-6 text-center transition hover:border-primary/70 hover:bg-primary/10 ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <input
        className="sr-only"
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(event) => onFile(event.target.files?.[0])}
        disabled={disabled}
      />
      <div className="mb-4 rounded-xl bg-primary/15 p-3 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
        <FileUp className="h-6 w-6" />
      </div>
      <p className="text-base font-semibold text-foreground">{file ? file.name : "Upload resume"}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">PDF or DOCX, up to 8MB. Text is extracted server-side for contextual interview questions.</p>
      {file && (
        <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          <X className="h-3 w-3" /> Ready
        </span>
      )}
    </label>
  );
}
