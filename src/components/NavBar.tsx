import { NavLink } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ButterflyMark from "@/components/ButterflyMark";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { useTheme } from "@/hooks/useTheme";
import { useMasthead } from "@/store/masthead";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/publications", label: "Publications" },
  { to: "/notes", label: "Notes" },
  { to: "/cv", label: "CV" },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();
  const signatureVisible = useMasthead((state) => state.signatureVisible);
  const reduceMotion = useReducedMotion();

  return (
    <header className="paper-grain sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]">
      <Container className="flex min-h-16 items-center justify-between gap-3">
        {/* The name joins the mark whenever the home page signature is not on screen. */}
        <NavLink
          to="/"
          aria-label={`${profile.name}, home`}
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[19px] font-medium text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          <ButterflyMark className="h-6 w-6 sm:h-7 sm:w-7" />
          <AnimatePresence initial={false}>
            {signatureVisible ? null : (
              <motion.span
                key="name"
                className="hidden sm:inline"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {profile.name}
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <div className="flex items-center gap-2 text-[14px] sm:gap-7 sm:text-[17px]">
          <nav className="flex items-center gap-[7px] sm:gap-6" aria-label="Primary navigation">
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
            className="text-[14px] text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] sm:text-[15px]"
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDark ? "Light" : "Dark"}
          </button>
        </div>
      </Container>
    </header>
  );
}
