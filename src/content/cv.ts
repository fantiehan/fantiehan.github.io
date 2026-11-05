import type { TimelineItem } from "@/content/types";

export const education: TimelineItem[] = [
  {
    range: "2026 - Present",
    title: "Ph.D., Nanjing University, Computer Science and Technology",
    subtitle: "School of Intelligence Science and Technology / NJU-PCA-Lab",
    icon: "university",
    logo: "logos/nju.svg",
    details: [
      "Advisor: Ying Tai",
    ],
  },
  {
    range: "2024 - 2026",
    title: "M.S., Nanjing University, Computer Science and Technology",
    subtitle: "School of Intelligence Science and Technology / NJU-PCA-Lab",
    icon: "university",
    logo: "logos/nju.svg",
    details: [
      "Advisor: Ying Tai",
    ],
  },
  {
    range: "2020 - 2024",
    title: "B.S., Northeastern University, Control Science and Engineering",
    subtitle: "College of Information Science and Engineering / NEU-DAO-Lab",
    icon: "university",
    logo: "logos/neu.svg",
    details: [
      "Advisors: Jian Wu & Jianxin Hou",
    ],
  },
];

export const internships: TimelineItem[] = [
  {
    range: "Jul 2025 - Oct 2026",
    title: "ByteDance / TikTok",
    subtitle: "Multimodal Algorithm Intern",
    icon: "company",
    logo: "logos/bytedance.svg",
    details: [],
  },
];

export const skills: { label: string; value: string }[] = [
  { label: "Languages", value: "English, Mandarin Chinese" },
  { label: "Coding", value: "Python, LaTeX, C/C++" },
  { label: "Web Dev", value: "HTML, CSS" },
  { label: "Misc.", value: "Academic research, LaTeX writing" },
];
