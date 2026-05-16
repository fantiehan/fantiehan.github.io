import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";
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
        <div className="py-16 sm:py-24">
          <motion.section
            initial="hidden"
            animate="show"
            variants={stagger}
            className="relative overflow-hidden rounded-[2.25rem] bg-white pb-10 pt-10 dark:bg-black sm:pb-14 sm:pt-14"
          >
            <motion.div variants={rise} transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">Academic Portfolio</Badge>
                <Badge>{profile.headline}</Badge>
              </div>

              <h1 className="font-display mt-7 max-w-[1040px] text-balance text-6xl font-semibold tracking-[-0.065em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-7xl lg:text-8xl">
                {profile.name}
              </h1>

              <div className="mt-9 grid gap-5 lg:grid-cols-3">
                {profile.intro.map((paragraph, index) => (
                  <motion.p
                    key={paragraph}
                    variants={rise}
                    transition={{ duration: 0.62, delay: 0.06 * index, ease: [0.22, 1, 0.36, 1] }}
                    className="border-t border-[#d2d2d7] pt-5 text-[15px] leading-8 text-[#515154] dark:border-white/12 dark:text-[#a1a1a6]"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
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
          </motion.section>

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
            <div className="surface-hairline rounded-[1.65rem] border border-[#d2d2d7]/80 bg-[#f5f5f7] p-6 shadow-[0_10px_34px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.075] dark:shadow-refined-dark">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-display text-2xl font-semibold tracking-[-0.035em] text-[#1d1d1f] dark:text-[#f5f5f7]">Reach out</div>
                  <div className="mt-2 text-sm text-[#6e6e73] dark:text-[#a1a1a6]">{profile.email}</div>
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
