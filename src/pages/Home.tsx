import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import PublicationCard from "@/components/PublicationCard";
import NewsList from "@/components/NewsList";
import { news } from "@/content/news";
import NotesList from "@/components/NotesList";
import { notes } from "@/content/notes";
import signature from "@/assets/brand/signature.png";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { publications, selectedPublicationIds } from "@/content/publications";
import { useMasthead } from "@/store/masthead";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const selected = publications.filter((paper) => selectedPublicationIds.includes(paper.id));
  const signatureRef = useRef<HTMLSpanElement>(null);
  const setSignatureVisible = useMasthead((state) => state.setSignatureVisible);

  // Tell the nav whether the signature is visible below the sticky bar (64px tall). Measure once
  // before paint so the nav never flashes the name, then let the observer follow scrolling.
  useLayoutEffect(() => {
    const node = signatureRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setSignatureVisible(rect.bottom > 64 && rect.top < window.innerHeight);
    const observer = new IntersectionObserver(([entry]) => setSignatureVisible(entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      setSignatureVisible(false);
    };
  }, [setSignatureVisible]);

  return (
    <Container>
      <motion.section
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-10 pb-12 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16"
      >
        <div>
          {/* The signature is the name; the text stays in the h1 for screen readers and search. */}
          <h1 className="m-0">
            <span className="sr-only">{profile.name}</span>
            <span
              ref={signatureRef}
              aria-hidden
              className="signature-ink -ml-1 block aspect-[1120/244] w-[min(100%,280px)] sm:w-[360px]"
              style={{ WebkitMaskImage: `url(${signature})`, maskImage: `url(${signature})` }}
            />
          </h1>
          <p className="mt-6 text-[22px] italic leading-[1.4] text-[var(--ink-soft)]">{profile.tagline}</p>

          <div className="mt-8 max-w-[64ch] space-y-5 text-[18px] leading-[1.7] text-[var(--ink)]">
            {profile.intro.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <aside className="self-start border-t border-[var(--line)] pt-6 text-[17px] lg:mt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="font-type text-[14px] text-[var(--ink-soft)]">Research interests</h2>
          <p className="mt-2 leading-[1.5] text-[var(--ink)]">{profile.interests}</p>

          <h2 className="mt-7 font-type text-[14px] text-[var(--ink-soft)]">Find me</h2>
          <ul className="mt-2 space-y-1.5">
            <li>
              <a className="ink-link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </li>
            <li>
              <a className="ink-link" href={profile.scholarUrl} target="_blank" rel="noreferrer">
                Google Scholar
              </a>
            </li>
            <li>
              <Link className="ink-link" to="/cv">
                Curriculum vitae
              </Link>
            </li>
          </ul>
        </aside>
      </motion.section>

      <Section title="News" className="max-w-[760px]">
        <NewsList items={news} />
      </Section>

      <Section
        title="Selected publications"
        action={
          <Link className="ink-link" to="/publications">
            All publications
          </Link>
        }
      >
        <div className="poster-shelf grid gap-x-8 gap-y-14 overflow-x-clip sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((paper) => (
            <PublicationCard key={paper.id} item={paper} />
          ))}
        </div>
      </Section>

      <Section title="Notes" className="max-w-[760px]">
        <NotesList limit={3} />
        <p className="mt-5 text-[17px] text-[var(--ink-soft)]">
          <Link className="ink-link" to="/notes">
            {notes.length - 3} more {notes.length - 3 === 1 ? "note" : "notes"}
          </Link>{" "}
          on how the work was done.
        </p>
      </Section>

      <div className="grid gap-x-16 lg:grid-cols-2">
        <Section title="Education">
          <Timeline items={education} />
        </Section>

        <Section title="Experience">
          <Timeline items={internships} />
        </Section>
      </div>
    </Container>
  );
}
