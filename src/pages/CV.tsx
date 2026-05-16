import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { ExternalLink, Mail } from "lucide-react";

export default function CV() {
  return (
    <Container>
      <div className="py-16 sm:py-24">
        <div className="mb-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="accent">Curriculum Vitae</Badge>
            <h1 className="font-display mt-5 text-5xl font-semibold tracking-[-0.055em] text-[#1d1d1f] dark:text-[#f5f5f7] sm:text-6xl">
              CV
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-8 text-[#515154] dark:text-[#a1a1a6]">
              A compact overview of education, research output, and contact information.
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

        <Section title="Profile" subtitle="A refined self-introduction for the web CV.">
          <div className="surface-hairline rounded-[1.65rem] border border-[#d2d2d7]/80 bg-[#f5f5f7] p-6 shadow-[0_10px_34px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-white/[0.075] dark:shadow-refined-dark">
            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0066cc] dark:text-[#2997ff]">Research identity</div>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.045em] text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {profile.name}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#6e6e73] dark:text-[#a1a1a6]">{profile.headline}</p>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-[#515154] dark:text-[#a1a1a6]">
                {profile.intro.slice(0, 2).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Education">
          <Timeline items={education} />
        </Section>

        <Section title="Internship">
          <Timeline items={internships} />
        </Section>
      </div>
    </Container>
  );
}
