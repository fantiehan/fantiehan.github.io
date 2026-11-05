import Container from "@/components/Container";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--line)]">
      <Container className="flex flex-col gap-3 py-8 text-[15px] text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Posters made with{" "}
          <a className="ink-link" href="https://github.com/fantiehan/paper2humanist-poster" target="_blank" rel="noreferrer">
            paper2humanist-poster
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <a className="ink-link" href={profile.scholarUrl} target="_blank" rel="noreferrer">
            Google Scholar
          </a>
          <a className="ink-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
