import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Mail, Sparkles } from "lucide-react";
import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
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
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const selected = publications.filter((p) => selectedPublicationIds.includes(p.id));

  return (
    <div>
      <Container>
        <div className="py-16 sm:py-20">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]"
          >
            <motion.div variants={rise} transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">Academic Portfolio</Badge>
                <Badge>{profile.headline}</Badge>
              </div>

              <h1 className="font-display mt-7 max-w-3xl text-balance text-5xl font-semibold tracking-[-0.055em] text-[#211f1b] dark:text-[#f6efe3] sm:text-6xl lg:text-7xl">
                {profile.name}
              </h1>

              <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-8 text-[#5f594f] dark:text-[#c9c0b1]">
                {profile.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={profile.scholarUrl} target="_blank" rel="noreferrer">
                  {profile.citationsLabel}
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="secondary" href={`mailto:${profile.email}`}>
                  Email
                  <Mail className="h-4 w-4" />
                </Button>
                <Button variant="ghost" href="#/cv">
                  View CV
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.aside
              variants={rise}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              className="surface-hairline relative overflow-hidden rounded-[2rem] border border-[#d8cdb9]/75 bg-[#fffdf7]/80 p-6 shadow-refined backdrop-blur dark:border-white/10 dark:bg-white/[0.055] dark:shadow-refined-dark"
            >
              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#b28a49]/12 blur-3xl dark:bg-[#d4b06a]/12" />
              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b7b43] dark:text-[#d4b06a]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Research Compass
                  </div>
                  <div className="font-display mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#211f1b] dark:text-[#f6efe3]">
                    Careful models for visual intelligence.
                  </div>
                </div>
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-[#d8cdb9]/70 bg-[#211f1b] px-3 py-2 text-xs font-semibold tracking-[0.18em] text-[#fffaf0] dark:border-[#d4b06a]/30 dark:bg-[#f6efe3] dark:text-[#11100e]">
                  TF
                </div>
              </div>

              <div className="relative mt-7 grid gap-3 text-sm">
                <div className="rounded-2xl border border-[#d8cdb9]/65 bg-[#f7f2ea]/58 p-4 dark:border-white/10 dark:bg-white/[0.045]">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#8b8274] dark:text-[#a99f91]">Focus</div>
                  <div className="mt-2 leading-6 text-[#353128] dark:text-[#f0e7d9]">{profile.interests}</div>
                </div>
                <div className="rounded-2xl border border-[#d8cdb9]/65 bg-white/45 p-4 dark:border-white/10 dark:bg-white/[0.035]">
                  <div className="text-xs uppercase tracking-[0.16em] text-[#8b8274] dark:text-[#a99f91]">Selected Work</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-[#211f1b] dark:text-[#f6efe3]">5</div>
                  <div className="text-xs text-[#746d62] dark:text-[#bdb4a6]">CVPR · ICLR · NeurIPS · Journal</div>
                </div>
              </div>
            </motion.aside>
          </motion.div>

          <Section title="Selected Publications" subtitle="A restrained selection of recent work in multimodal understanding and generation.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {selected.map((p) => (
                <PublicationCard key={p.id} item={p} />
              ))}
            </div>
            <div className="mt-6">
              <Button variant="secondary" href="#/publications">
                View all publications
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Section>

          <Section title="Education" subtitle="A concise view of academic milestones.">
            <Timeline items={education} />
          </Section>

          <Section title="Internship" subtitle="Current industry role and research-facing engineering practice.">
            <Timeline items={internships} />
          </Section>

          <Section title="Contact" subtitle="Open to research collaboration and thoughtful conversations around multimodal systems.">
            <div className="surface-hairline rounded-[1.65rem] border border-[#d8cdb9]/75 bg-[#fffdf7]/80 p-6 shadow-refined backdrop-blur dark:border-white/10 dark:bg-white/[0.055] dark:shadow-refined-dark">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-display text-2xl font-semibold tracking-[-0.035em] text-[#211f1b] dark:text-[#f6efe3]">Reach out</div>
                  <div className="mt-2 text-sm text-[#746d62] dark:text-[#bdb4a6]">{profile.email}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="secondary" href={`mailto:${profile.email}`}>
                    Email
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button href={profile.scholarUrl} target="_blank" rel="noreferrer">
                    Google Scholar
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </Container>
    </div>
  );
}
