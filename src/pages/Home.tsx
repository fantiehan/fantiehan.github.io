import Container from "@/components/Container";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Badge from "@/components/Badge";
import Timeline from "@/components/Timeline";
import PublicationCard from "@/components/PublicationCard";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { publications, selectedPublicationIds } from "@/content/publications";
import { ArrowRight, ExternalLink, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const selected = publications.filter((p) => selectedPublicationIds.includes(p.id));

  return (
    <div>
      <Container>
        <div className="py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="accent">{profile.headline}</Badge>
                <Badge>{profile.interests}</Badge>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {profile.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-zinc-300">
                Hello, everyone — I'm Tiehan Fan. I focus on multimodal understanding and visual generation, and I enjoy building clean, scalable systems backed by careful empirical study. I like research that connects to real-world impact, so feel free to browse my work or reach out to collaborate.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
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
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Quick Profile</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-zinc-400">Based on the current CV</div>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
                  TF
                </div>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-zinc-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-slate-500 dark:text-zinc-400">Interests</div>
                  <div className="text-right">{profile.interests}</div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-slate-500 dark:text-zinc-400">Email</div>
                  <a href={`mailto:${profile.email}`} className="text-right hover:text-slate-900 dark:hover:text-white">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div className="text-slate-500 dark:text-zinc-400">Scholar</div>
                  <a
                    href={profile.scholarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-end gap-2 hover:text-slate-900 dark:hover:text-white"
                  >
                    Open
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <Section title="Selected Publications"
            subtitle="A curated set of recent work."
          >
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

          <Section title="Internship" subtitle="Current industry role and focus.">
            <Timeline items={internships} />
          </Section>

          <Section title="Contact" subtitle="Open to research collaboration.">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Reach out</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{profile.email}</div>
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
