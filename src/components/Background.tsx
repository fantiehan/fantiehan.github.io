export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[var(--paper)]">
      <div className="absolute inset-0 paper-grain" />
    </div>
  );
}
