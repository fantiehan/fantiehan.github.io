import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Timeline from "@/components/Timeline";
import PublicationCard from "@/components/PublicationCard";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { publications, selectedPublicationIds } from "@/content/publications";

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

export default function Home() {
  const reduceMotion = useReducedMotion();
  const selected = publications.filter((paper) => selectedPublicationIds.includes(paper.id));

  return (
    <Container>
      <div className="py-10 sm:py-14">
        <motion.section
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={stagger}
          className="border-b-2 border-[var(--line-strong)] pb-8"
        >
          <motion.div
            variants={rise}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[11px] tracking-[0.18em] text-[var(--ink-soft)]"
          >
            {profile.interests}
          </motion.div>

          <motion.h1
            variants={rise}
            transition={{ duration: 0.66, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-[980px] text-balance font-display text-[clamp(46px,9vw,92px)] font-semibold leading-[0.98] tracking-[0.005em] text-[var(--ink)]"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-[56ch] font-display text-[22px] italic leading-8 text-[var(--ink-soft)]"
          >
            {profile.headline}
          </motion.p>

          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {profile.intro.map((paragraph, index) => (
              <motion.p
                key={paragraph}
                variants={rise}
                transition={{ duration: 0.56, delay: reduceMotion ? 0 : index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="border-t border-[var(--line)] pt-5 text-[16px] leading-8 text-[var(--ink)]"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            variants={rise}
            transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button href={profile.scholarUrl} target="_blank" rel="noreferrer">
              {profile.citationsLabel}
            </Button>
            <Button variant="secondary" href="#/cv">View CV</Button>
            <Button variant="ghost" href={`mailto:${profile.email}`}>Email</Button>
          </motion.div>
        </motion.section>

        <Section title="Selected papers">
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {selected.map((paper) => (
              <PublicationCard key={paper.id} item={paper} />
            ))}
          </div>
          <div className="mt-7">
            <Button variant="secondary" href="#/publications">Open full archive</Button>
          </div>
        </Section>

        <div className="grid gap-10 lg:grid-cols-2">
          <Section title="Education" className="py-10">
            <Timeline items={education} />
          </Section>

          <Section title="Internship" className="py-10">
            <Timeline items={internships} />
          </Section>
        </div>

        <Section title="Contact">
          <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-6 shadow-paper-soft">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-[28px] font-semibold leading-tight text-[var(--ink)]">{profile.name}</h3>
                <p className="mt-2 font-mono text-[12px] text-[var(--ink-soft)]">{profile.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" href={`mailto:${profile.email}`}>Email</Button>
                <Button href={profile.scholarUrl} target="_blank" rel="noreferrer">Google Scholar</Button>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </Container>
  );
}
