export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-white dark:bg-black" />
      <div className="absolute inset-x-0 top-0 h-[36rem] apple-sheen dark:bg-[radial-gradient(circle_at_50%_-20%,rgba(41,151,255,0.18),transparent_34rem)]" />
      <div className="absolute -right-40 top-28 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(0,113,227,0.065),transparent_64%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(41,151,255,0.11),transparent_66%)]" />
    </div>
  );
}
