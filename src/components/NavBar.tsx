import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { Mail, GraduationCap, FileText, Home, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/publications", label: "Publications", icon: GraduationCap },
  { to: "/cv", label: "CV", icon: FileText },
];

export default function NavBar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-white/10 dark:bg-[#0B0D12]/70 dark:supports-[backdrop-filter]:bg-[#0B0D12]/50">
      <Container className="flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
            TF
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Tiehan Fan</div>
            <div className="text-xs text-slate-500 dark:text-zinc-400">Multimodal & Generation</div>
          </div>
        </NavLink>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex h-10 items-center gap-2 rounded-full px-4 text-sm text-slate-600 transition-all duration-200 ease-out hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white",
                      isActive && "bg-slate-100 text-slate-900 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/20",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="h-4 w-4 opacity-80" />
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "absolute inset-x-4 -bottom-[1px] h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent transition",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </>
                  )}
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
                      "grid h-10 w-10 place-items-center rounded-full text-slate-600 transition-all duration-200 ease-out hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white",
                      isActive && "bg-slate-100 text-slate-900 ring-1 ring-slate-200 dark:bg-white/10 dark:text-white dark:ring-white/20",
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
            className="grid h-10 w-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href="mailto:fantiehan@outlook.com"
            className="hidden h-10 items-center gap-2 rounded-full px-4 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white md:flex"
          >
            <Mail className="h-4 w-4 opacity-80" />
            Email
          </a>
        </div>
      </Container>
    </div>
  );
}
