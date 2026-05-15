import Container from "@/components/Container";
import { ExternalLink } from "lucide-react";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="border-t border-[#d8cdb9]/70 dark:border-white/10">
      <Container className="flex flex-col gap-4 py-10 text-sm text-[#746d62] dark:text-[#bdb4a6] sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} {profile.name}. Built with restraint and care.</div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={profile.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-[#211f1b] dark:hover:text-white"
          >
            Google Scholar
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href={`mailto:${profile.email}`} className="transition hover:text-[#211f1b] dark:hover:text-white">
            {profile.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
