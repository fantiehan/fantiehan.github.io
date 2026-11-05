import Container from "@/components/Container";
import NotesList from "@/components/NotesList";

export default function Notes() {
  return (
    <Container>
      <header className="pb-8 pt-14 sm:pt-20">
        <h1 className="text-[clamp(44px,7vw,68px)] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--ink)]">Notes</h1>
        <p className="mt-4 max-w-[60ch] text-[19px] leading-[1.6] text-[var(--ink-soft)]">
          Short explanations of how the work was done, what the numbers show, and where the limits are.
        </p>
      </header>
      <div className="max-w-[760px] pb-10">
        <NotesList />
      </div>
    </Container>
  );
}
