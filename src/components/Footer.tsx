import { Link } from "react-router-dom";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { formatDate } from "@/utils/publication";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--line)]">
      <Container className="grid gap-5 py-9 text-[16px] leading-[1.6] text-[var(--ink-soft)] md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
        <div className="max-w-[62ch]">
          <p>
            Set in Newsreader, with Courier Prime for dates and venues. Posters made with{" "}
            <a className="ink-link" href="https://github.com/fantiehan/paper2humanist-poster" target="_blank" rel="noreferrer">
              paper2humanist-poster
            </a>
            , a workflow that turns each paper's method into one image.{" "}
            <Link className="ink-link" to="/notes/how-the-posters-are-made">
              Read how they are made
            </Link>
            .
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {profile.name}. Last updated {formatDate(__BUILD_DATE__)}.
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
