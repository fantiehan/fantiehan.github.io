import Container from "@/components/Container";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-2 border-[var(--line-strong)] bg-[var(--paper)]">
      <Container className="flex flex-col gap-4 py-9 font-mono text-[11px] leading-6 tracking-[0.08em] text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} {profile.name}. Personal research archive.</div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={profile.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="border-b border-transparent transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Google Scholar
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="border-b border-transparent transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {profile.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
