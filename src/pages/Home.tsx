import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import PenStroke from "@/components/PenStroke";
import PublicationCard from "@/components/PublicationCard";
import NewsList from "@/components/NewsList";
import { news } from "@/content/news";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { publications, selectedPublicationIds } from "@/content/publications";

export default function Home() {
  const reduceMotion = useReducedMotion();
  const selected = publications.filter((paper) => selectedPublicationIds.includes(paper.id));

  return (
    <Container>
      <motion.section
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-10 pb-12 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16"
      >
        <div>
          <h1 className="relative inline-block pb-3 text-[clamp(48px,8vw,80px)] font-medium leading-[1.02] tracking-[-0.01em] text-[var(--ink)]">
            {profile.name}
            <PenStroke animate className="absolute bottom-0 left-0 h-3 w-full text-[var(--accent)]" />
          </h1>
          <p className="mt-5 text-[22px] italic leading-[1.4] text-[var(--ink-soft)]">{profile.headline}</p>

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
              <span className="text-[var(--ink-soft)]"> ({profile.citationsLabel.replace(/^.*?:\s*/, "")} citations)</span>
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
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((paper) => (
            <PublicationCard key={paper.id} item={paper} />
          ))}
        </div>
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
