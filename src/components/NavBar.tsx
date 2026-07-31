import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/publications", label: "Papers" },
  { to: "/cv", label: "CV" },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--line-strong)] bg-[var(--paper)] backdrop-blur-md">
      <Container className="flex min-h-16 items-center justify-between gap-4 py-3">
        <NavLink to="/" className="group flex min-w-0 items-baseline gap-3">
          <span className="font-display text-2xl font-semibold leading-none tracking-[0.01em] text-[var(--ink)] transition group-hover:text-[var(--accent)]">
            TF
          </span>
          <span className="hidden truncate font-mono text-[10.5px] tracking-[0.16em] text-[var(--ink-soft)] sm:inline">
            {profile.name} / research archive
          </span>
        </NavLink>

        <div className="flex shrink-0 items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-[var(--ink-soft)]">
          <nav className="flex items-center gap-3 sm:gap-5" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "border-b border-transparent pb-1 transition hover:border-[var(--accent)] hover:text-[var(--ink)]",
                    isActive && "border-[var(--accent)] text-[var(--ink)]",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleTheme}
            className="border border-[var(--line)] px-2.5 py-1 text-[var(--ink-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            aria-label="Toggle theme"
          >
            {isDark ? "Light" : "Dark"}
          </button>

          <a
            href={`mailto:${profile.email}`}
            className="hidden border-b border-transparent pb-1 transition hover:border-[var(--accent)] hover:text-[var(--ink)] md:inline"
          >
            Email
          </a>
        </div>
      </Container>
    </header>
  );
}
