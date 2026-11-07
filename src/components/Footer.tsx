import { Link } from "react-router-dom";
import Container from "@/components/Container";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="site-footer rule-t relative mt-12">
      <Container className="grid gap-5 py-9 text-[16px] leading-[1.6] text-[var(--ink-soft)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        <div className="max-w-[62ch]">
          <p>
            Posters made with{" "}
            <a className="ink-link" href="https://github.com/fantiehan/paper2humanist-poster" target="_blank" rel="noreferrer">
              paper2humanist-poster
            </a>
            .{" "}
            <Link className="ink-link" to="/notes/how-the-posters-are-made">
              How they are made
            </Link>
            .
          </p>
          {/* The credits for type and borrowed designs are kept in the repository's README. */}
          <p className="mt-2">
            © {new Date().getFullYear()} {profile.name}.
          </p>
        </div>
        <ul className="space-y-1">
          <li>
            <a className="ink-link" href={profile.scholarUrl} target="_blank" rel="noreferrer">
              Google Scholar
            </a>
          </li>
          <li>
            <a className="ink-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
