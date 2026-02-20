export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[#f5f7fb] dark:bg-[#0B0D12]" />
      <div className="absolute -top-32 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-400/25 via-blue-300/10 to-transparent blur-3xl dark:from-blue-500/25 dark:via-blue-500/10" />
      <div className="absolute bottom-[-240px] left-[-180px] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-slate-200/60 via-white/30 to-transparent blur-3xl dark:from-white/10 dark:via-white/5" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(transparent_1px,rgba(15,23,42,0.06)_1px)] [background-size:24px_24px] dark:opacity-[0.05] dark:[background-image:radial-gradient(transparent_1px,rgba(255,255,255,0.04)_1px)]" />
    </div>
  );
}
