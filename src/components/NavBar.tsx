import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/publications", label: "Publications" },
  { to: "/cv", label: "CV" },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <NavLink to="/" className="shrink-0 whitespace-nowrap text-[20px] font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]">
          <span className="sm:hidden">TF</span>
          <span className="hidden sm:inline">{profile.name}</span>
        </NavLink>

        <div className="flex items-center gap-4 text-[16px] sm:gap-7 sm:text-[17px]">
          <nav className="flex items-center gap-3.5 sm:gap-6" aria-label="Primary navigation">
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
