export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#f7f2ea] dark:bg-[#08090b]" />
      <div className="absolute left-1/2 top-[-18rem] h-[42rem] w-[68rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(178,138,73,0.18),rgba(178,138,73,0.07)_36%,transparent_68%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(212,176,106,0.18),rgba(112,134,185,0.08)_42%,transparent_70%)]" />
      <div className="absolute -right-48 top-32 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(33,31,27,0.08),transparent_64%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(246,239,227,0.08),transparent_66%)]" />
      <div className="absolute bottom-[-24rem] left-[-16rem] h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.72),transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(212,176,106,0.08),transparent_64%)]" />
      <div className="grain-mask absolute inset-0 opacity-[0.55] mix-blend-multiply dark:opacity-[0.14] dark:mix-blend-screen" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#f7f2ea]/90 to-transparent dark:from-[#08090b]/90" />
    </div>
  );
}
