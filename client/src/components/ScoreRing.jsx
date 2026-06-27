export function ScoreRing({ label, value }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 place-items-center rounded-full text-sm font-bold text-foreground"
          style={{ background: `conic-gradient(var(--primary) ${score * 3.6}deg, rgba(148, 163, 184, 0.18) 0deg)` }}
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-background">{score}</div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">out of 100</p>
        </div>
      </div>
    </div>
  );
}
