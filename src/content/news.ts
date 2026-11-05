import type { NewsItem } from "@/content/types";

// Dates come from official decision announcements and arXiv submission histories.
// OpenVid++ has no public decision date yet, so it keeps month precision.
export const news: NewsItem[] = [
  { date: "2026-08-03", kind: "preprint", publicationId: "yang2026romerl" },
  { date: "2026-08", kind: "accepted", publicationId: "nan2026openvidplusplus" },
  { date: "2026-07-02", kind: "preprint", publicationId: "zhao2026tca" },
  { date: "2026-06-17", kind: "accepted", publicationId: "zhao2026tca" },
  { date: "2026-01-25", kind: "accepted", publicationId: "du2025motionsight" },
  { date: "2025-10-23", kind: "preprint", publicationId: "zhao2025ultrahr" },
  { date: "2025-09-18", kind: "accepted", publicationId: "zhao2025ultrahr" },
  { date: "2025-06-02", kind: "preprint", publicationId: "du2025motionsight" },
  { date: "2025-02-26", kind: "accepted", publicationId: "fan2025instancecap" },
  { date: "2025-01-22", kind: "accepted", publicationId: "nan2024openvid" },
  { date: "2024-12-12", kind: "preprint", publicationId: "fan2025instancecap" },
  { date: "2024-07-02", kind: "preprint", publicationId: "nan2024openvid" },
  { date: "2023-09-25", kind: "published", publicationId: "fan2023effective" },
];
