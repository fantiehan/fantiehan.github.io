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
    <header className="sticky top-0 z-50 border-b border-[#d2d2d7]/70 bg-white/82 backdrop-blur-2xl dark:border-white/12 dark:bg-black/72">
      <Container className="flex h-14 items-center justify-between">
        <NavLink to="/" className="group flex items-center gap-3 rounded-full">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-[#1d1d1f] text-[11px] font-semibold tracking-[0.12em] text-white transition group-hover:scale-[1.03] dark:bg-[#f5f5f7] dark:text-black">
            TF
          </div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-semibold tracking-[-0.015em] text-[#1d1d1f] dark:text-[#f5f5f7]">
              {profile.name}
            </div>
            <div className="mt-0.5 text-[11px] text-[#6e6e73] dark:text-[#a1a1a6]">
              Multimodal · Generation
            </div>
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
                      "group flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-[#515154] transition duration-300 ease-out hover:bg-[#f5f5f7] hover:text-[#1d1d1f] dark:text-[#d2d2d7] dark:hover:bg-white/[0.08] dark:hover:text-white",
                      isActive &&
                        "bg-[#f5f5f7] text-[#0066cc] dark:bg-white/[0.1] dark:text-[#2997ff]",
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
                      "grid h-9 w-9 place-items-center rounded-full text-[#515154] transition duration-300 hover:bg-[#f5f5f7] hover:text-[#1d1d1f] dark:text-[#d2d2d7] dark:hover:bg-white/[0.08] dark:hover:text-white",
                      isActive && "bg-[#f5f5f7] text-[#0066cc] dark:bg-white/[0.1] dark:text-[#2997ff]",
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
            className="grid h-9 w-9 place-items-center rounded-full text-[#515154] transition duration-300 hover:bg-[#f5f5f7] hover:text-[#1d1d1f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3]/45 dark:text-[#d2d2d7] dark:hover:bg-white/[0.08] dark:hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={`mailto:${profile.email}`}
            className="hidden h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-[#515154] transition duration-300 hover:bg-[#f5f5f7] hover:text-[#1d1d1f] dark:text-[#d2d2d7] dark:hover:bg-white/[0.08] dark:hover:text-white md:flex"
          >
            <Mail className="h-4 w-4 opacity-75" />
            Email
          </a>
        </div>
      </Container>
    </header>
  );
}
