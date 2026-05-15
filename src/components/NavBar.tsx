import { NavLink } from "react-router-dom";
import { Mail, GraduationCap, FileText, Home, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { profile } from "@/content/profile";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/publications", label: "Publications", icon: GraduationCap },
  { to: "/cv", label: "CV", icon: FileText },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-3 z-50">
      <Container>
        <div className="surface-hairline flex h-16 items-center justify-between rounded-full border border-[#d8cdb9]/70 bg-[#fffaf0]/75 px-3 shadow-[0_18px_50px_rgba(34,30,24,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0c0c0c]/60 dark:shadow-[0_18px_60px_rgba(0,0,0,0.38)] sm:px-4">
          <NavLink to="/" className="group flex items-center gap-3 rounded-full pr-2">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#cfc1aa] bg-[#211f1b] text-xs font-semibold tracking-[0.18em] text-[#fffaf0] shadow-[0_8px_20px_rgba(33,31,27,0.14)] transition group-hover:scale-[1.02] dark:border-[#d4b06a]/30 dark:bg-[#f6efe3] dark:text-[#11100e]">
              TF
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-[15px] font-semibold tracking-[-0.025em] text-[#211f1b] dark:text-[#f6efe3]">
                {profile.name}
              </div>
              <div className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-[#81786a] dark:text-[#a99f91]">
                Multimodal · Generation
              </div>
            </div>
          </NavLink>

          <div className="flex items-center gap-1.5">
            <nav className="hidden items-center gap-1 rounded-full border border-[#d8cdb9]/55 bg-white/35 p-1 dark:border-white/10 dark:bg-white/[0.035] sm:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-[#6d675d] transition duration-300 ease-out hover:bg-[#211f1b]/[0.045] hover:text-[#211f1b] dark:text-[#c9c0b1] dark:hover:bg-white/[0.06] dark:hover:text-white",
                        isActive &&
                          "bg-[#211f1b] text-[#fffaf0] shadow-[0_8px_20px_rgba(33,31,27,0.12)] hover:bg-[#211f1b] hover:text-[#fffaf0] dark:bg-[#f6efe3] dark:text-[#11100e] dark:hover:bg-white dark:hover:text-[#11100e]",
                      )
                    }
                  >
                    <Icon className="h-4 w-4 opacity-75" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <nav className="flex items-center gap-1 sm:hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "grid h-10 w-10 place-items-center rounded-full text-[#6d675d] transition duration-300 hover:bg-[#211f1b]/[0.05] hover:text-[#211f1b] dark:text-[#c9c0b1] dark:hover:bg-white/[0.06] dark:hover:text-white",
                        isActive && "bg-[#211f1b] text-[#fffaf0] dark:bg-[#f6efe3] dark:text-[#11100e]",
                      )
                    }
                    aria-label={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </NavLink>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full text-[#6d675d] transition duration-300 hover:bg-[#211f1b]/[0.05] hover:text-[#211f1b] focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/45 dark:text-[#c9c0b1] dark:hover:bg-white/[0.06] dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="hidden h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-[#6d675d] transition duration-300 hover:bg-[#211f1b]/[0.05] hover:text-[#211f1b] dark:text-[#c9c0b1] dark:hover:bg-white/[0.06] dark:hover:text-white md:flex"
            >
              <Mail className="h-4 w-4 opacity-75" />
              Email
            </a>
          </div>
        </div>
      </Container>
    </header>
  );
}
