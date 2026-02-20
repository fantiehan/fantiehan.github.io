import Container from "@/components/Container";
import { ExternalLink } from "lucide-react";
import { profile } from "@/content/profile";

export default function Footer() {
  return (
    <div className="border-t border-slate-200/70 dark:border-white/10">
      <Container className="flex flex-col gap-3 py-10 text-sm text-slate-500 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} {profile.name}. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a
            href={profile.scholarUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-slate-900 dark:hover:text-white"
          >
            Google Scholar
            <ExternalLink className="h-4 w-4" />
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-slate-900 dark:hover:text-white">
            {profile.email}
          </a>
        </div>
      </Container>
    </div>
  );
}
