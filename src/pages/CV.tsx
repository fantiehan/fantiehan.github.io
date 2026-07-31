import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { profile } from "@/content/profile";
import { education, internships, skills } from "@/content/cv";

export default function CV() {
  return (
    <Container>
      <div className="py-10 sm:py-14">
        <header className="border-b-2 border-[var(--line-strong)] pb-8">
          <Badge variant="accent">Curriculum Vitae</Badge>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_0.52fr] lg:items-end">
            <div>
              <h1 className="font-display text-[clamp(46px,8vw,82px)] font-semibold leading-none text-[var(--ink)]">
                CV
              </h1>
              <p className="mt-4 max-w-2xl text-[18px] leading-8 text-[var(--ink-soft)]">
                A compact overview of education, research output, skills, and contact information.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Button variant="secondary" href="/CV.pdf" target="_blank" rel="noreferrer">View PDF</Button>
              <Button variant="ghost" href="/CV.pdf" download>Download PDF</Button>
            </div>
          </div>
        </header>

        <Section title="Profile" meta="research identity">
          <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-6 shadow-paper-soft">
            <div className="grid gap-7 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-[var(--accent)]">{profile.headline}</p>
                <h2 className="mt-3 text-[34px] font-semibold leading-tight text-[var(--ink)]">
                  {profile.name}
                </h2>
                <p className="mt-3 text-[16px] leading-7 text-[var(--ink-soft)]">{profile.interests}</p>
              </div>
              <div className="space-y-5 text-[17px] leading-8 text-[var(--ink)]">
                {profile.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title="Education" meta="degrees and labs">
          <Timeline items={education} />
        </Section>

        <Section title="Internship" meta="industry research">
          <Timeline items={internships} />
        </Section>

        <Section title="Skills" meta="compact list">
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((item) => (
              <div key={item.label} className="border border-[var(--line)] bg-[var(--paper-deep)] p-5 shadow-paper-soft">
                <div className="font-mono text-[11px] tracking-[0.14em] text-[var(--accent)]">{item.label}</div>
                <div className="mt-3 text-[17px] leading-7 text-[var(--ink)]">{item.value}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Contact" meta="email and scholar">
          <div className="border border-[var(--line)] bg-[var(--paper-deep)] p-6 shadow-paper-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[12px] text-[var(--ink-soft)]">{profile.email}</p>
                <p className="mt-2 text-[16px] leading-7 text-[var(--ink-soft)]">{profile.citationsLabel}</p>
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
