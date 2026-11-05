import { NavLink, useLocation } from "react-router-dom";
import ButterflyMark from "@/components/ButterflyMark";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/publications", label: "Publications" },
  { to: "/notes", label: "Notes" },
  { to: "/cv", label: "CV" },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();
  const isHome = useLocation().pathname === "/";

  return (
    <header className="paper-grain sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        {/* The home page already opens with the signature, so the bar shows the name only elsewhere. */}
        <NavLink
          to="/"
          aria-label={`${profile.name}, home`}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[19px] font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          <ButterflyMark className="h-7 w-7" />
          {isHome ? null : <span className="hidden sm:inline">{profile.name}</span>}
        </NavLink>

        <div className="flex items-center gap-3 text-[15px] sm:gap-7 sm:text-[17px]">
          <nav className="flex items-center gap-2.5 sm:gap-6" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "underline-offset-[6px] transition-colors hover:text-[var(--ink)]",
                    isActive
                      ? "text-[var(--ink)] underline decoration-[var(--accent)] decoration-[1.5px]"
                      : "text-[var(--ink-soft)]",
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
            className="text-[15px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </Container>
    </header>
  );
}
