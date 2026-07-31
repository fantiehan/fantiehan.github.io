export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--paper)]">
      <div className="absolute inset-0 paper-grain opacity-90" />
      <div className="absolute left-[7vw] top-24 h-28 w-44 rotate-[-5deg] border border-[var(--line)] bg-[var(--paper-deep)] opacity-[0.35]" />
      <div className="absolute bottom-20 right-[8vw] h-36 w-24 rotate-[7deg] border border-[var(--line)] bg-[var(--paper-soft)] opacity-30" />
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--line-strong)] opacity-60" />
    </div>
  );
}
