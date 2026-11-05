import Container from "@/components/Container";
import Section from "@/components/Section";
import Timeline from "@/components/Timeline";
import Button from "@/components/Button";
import { profile } from "@/content/profile";
import { education, internships } from "@/content/cv";
import { publications } from "@/content/publications";

export default function CV() {
  const firstAuthor = publications.filter((paper) => paper.contributionTag);

  return (
    <Container>
      <header className="flex flex-col gap-6 pb-4 pt-14 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[clamp(44px,7vw,68px)] font-medium leading-[1.05] tracking-[-0.01em] text-[var(--ink)]">
            Curriculum vitae
          </h1>
          <p className="mt-4 max-w-[60ch] text-[19px] leading-[1.6] text-[var(--ink-soft)]">{profile.headline}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="CV.pdf" target="_blank" rel="noreferrer">
            Open PDF
          </Button>
          <Button variant="secondary" href="CV.pdf" download>
            Download PDF
          </Button>
        </div>
      </header>

      <div className="grid gap-x-16 lg:grid-cols-2">
        <Section title="Education">
          <Timeline items={education} />
        </Section>
        <div>
          <Section title="Experience">
            <Timeline items={internships} />
          </Section>
          <Section title="First-author work" className="pt-0 sm:pt-0">
            <ul className="space-y-4">
              {firstAuthor.map((paper) => (
                <li key={paper.id}>
                  <p className="font-type text-[14px] text-[var(--ink-soft)]">
                    {paper.venue} {paper.year}, {paper.contributionTag.toLowerCase()}
                  </p>
                  <p className="mt-1 text-[17px] leading-[1.4] text-[var(--ink)]">{paper.title}</p>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <Section title="Contact">
        <p className="max-w-[60ch] text-[18px] leading-[1.7]">
          Email{" "}
          <a className="ink-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>{" "}
          or find the full publication record on{" "}
          <a className="ink-link" href={profile.scholarUrl} target="_blank" rel="noreferrer">
            Google Scholar
          </a>
          .
        </p>
      </Section>
    </Container>
  );
}
