import type { TimelineItem } from "@/content/types";

export const education: TimelineItem[] = [
  {
    range: "2024 — Present",
    title: "M.S., Nanjing University, Computer Science and Technology",
    subtitle: "School of Intelligence Science and Technology · NJU-PCA-Lab",
    icon: "university",
    logo: "/logos/nju.svg",
    details: [
      "Advisor: Ying Tai",
      "Publications: CVPR ×1, ICLR ×2, NeurIPS ×1",
    ],
  },
  {
    range: "2020 — 2024",
    title: "B.S., Northeastern University, Control Science and Engineering",
    subtitle: "College of Information Science and Engineering · NEU-DAO-Lab",
    icon: "university",
    logo: "/logos/neu.svg",
    details: [
      "Advisors: Jian Wu & Jianxin Hou",
      "Publications: SCI (JCR Q2) ×1",
    ],
  },
];

export const internships: TimelineItem[] = [
  {
    range: "2025 — Present",
    title: "ByteDance · TikTok",
    subtitle: "Multimodal Algorithm Intern",
    icon: "company",
    logo: "/logos/bytedance.svg",
    details: [],
  },
];

export const skills: { label: string; value: string }[] = [
  { label: "Languages", value: "English, Mandarin Chinese" },
  { label: "Coding", value: "Python, LaTeX, C/C++" },
  { label: "Web Dev", value: "HTML, CSS" },
  { label: "Misc.", value: "Academic research, LaTeX writing" },
];
