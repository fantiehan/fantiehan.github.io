import { Link } from "react-router-dom";
import Container from "@/components/Container";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="site-footer rule-t relative mt-12">
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
            The opening sheet and the vine beside selected text are adapted from LeiBox's{" "}
            <a className="ink-link" href="https://leibox.pantoria.cn/docs/animations/crumpled-paper" target="_blank" rel="noreferrer">
              Crumpled Paper
            </a>{" "}
            (design reference by Matt) and{" "}
            <a className="ink-link" href="https://leibox.pantoria.cn/docs/animations/selection-flower" target="_blank" rel="noreferrer">
              Selection Flower
            </a>{" "}
            (design reference by Omerico). The note on the sheet is lettered in Covered By Your Grace.
          </p>
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
