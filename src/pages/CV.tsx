import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { profile } from "@/content/profile";
import { education, internships, skills } from "@/content/cv";
import { ExternalLink, Mail } from "lucide-react";

export default function CV() {
  return (
    <Container>
      <div className="py-14">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">CV</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-zinc-300">
              A structured view based on the current CV source. 
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" href="/CV.pdf" target="_blank" rel="noreferrer">
              View PDF
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" href="/CV.pdf" download>
              Download PDF
              <ExternalLink className="h-4 w-4" />
            </Button>
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

        <Section title="Education">
          <Timeline items={education} />
        </Section>

        <Section title="Internship">
          <Timeline items={internships} />
        </Section>

        <Section title="Skills" subtitle="A compact summary.">
          <div className="grid gap-3 md:grid-cols-2">
            {skills.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{s.label}</div>
                  <Badge>{s.value.split(",").length} items</Badge>
                </div>
                <div className="mt-2 text-sm leading-7 text-slate-600 dark:text-zinc-300">{s.value}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </Container>
  );
}
