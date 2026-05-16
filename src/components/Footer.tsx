import Container from "@/components/Container";
import { ExternalLink } from "lucide-react";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <footer className="border-t border-[#d2d2d7] bg-white dark:border-white/12 dark:bg-black">
      <Container className="flex flex-col gap-4 py-10 text-sm text-[#6e6e73] dark:text-[#a1a1a6] sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} {profile.name}. Built with restraint and care.</div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={profile.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[#0066cc] transition hover:text-[#0071e3] dark:text-[#2997ff] dark:hover:text-[#6bb8ff]"
          >
            Google Scholar
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href={`mailto:${profile.email}`} className="transition hover:text-[#1d1d1f] dark:hover:text-white">
            {profile.email}
          </a>
        </div>
      </Container>
    </footer>
  );
}
