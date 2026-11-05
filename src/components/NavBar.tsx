import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ButterflyMark from "@/components/ButterflyMark";
import PenStroke from "@/components/PenStroke";
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
  const { pathname } = useLocation();

  return (
    <header className="paper-grain rule-b sticky top-0 z-40 bg-[var(--paper)]">
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
                    "relative transition-colors hover:text-[var(--ink)]",
                    isActive ? "text-[var(--ink)]" : "text-[var(--ink-soft)]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {/* The one pen stroke in the bar, which travels to whichever page is open. */}
                    {isActive ? (
                      <motion.span
                        layoutId="nav-stroke"
                        layoutDependency={pathname}
                        className="absolute -bottom-1.5 left-0 right-0 block"
                        transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.3, 0, 0.2, 1] }}
                      >
                        <PenStroke className="h-1.5 w-full text-[var(--accent)]" />
                      </motion.span>
                    ) : null}
                  </>
                )}
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
