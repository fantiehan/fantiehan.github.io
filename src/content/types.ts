export type PublicationType = "conference" | "journal" | "preprint";

export type ContributionTag = "First Author" | "Co-First Author" | "";

export type PosterLayout =
  | "lifted-cell"
  | "motion-thread"
  | "dataset-grid"
  | "resolution-window"
  | "alloy-sheet"
  | "alignment-bridge";

export type PublicationPoster = {
  archive: string;
  shortTitle: string;
  concept: string;
  accent: string;
  layout: PosterLayout;
  meta: string;
  caption: string;
  imageUrl?: string;
  /** Theme shown above the poster in the posters note. */
  theme: string;
  /** What the image depicts and how that maps to the paper's method. */
  derivation: string;
};

export type Publication = {
  id: string;
  title: string;
  venue: string;
  year: number;
  type: PublicationType;
  authors: string;
  contributionTag: ContributionTag;
  screenshotPrompt: string;
  screenshotUrl?: string;
  paperUrl?: string;
  scholarUrl?: string;
  poster: PublicationPoster;
};

export type TimelineItem = {
  range: string;
  title: string;
  subtitle?: string;
  details: string[];
  icon?: "university" | "company";
  logo?: string;
};

export type Profile = {
  name: string;
  headline: string;
  tagline: string;
  interests: string;
  citationsLabel: string;
  email: string;
  scholarUrl: string;
  intro: string[];
};

export type NewsKind = "accepted" | "preprint" | "published";

export type NewsItem = {
  /** "YYYY-MM-DD" when the exact day is known, otherwise "YYYY-MM". */
  date: string;
  kind: NewsKind;
  publicationId: string;
};

export type NoteBlock =
  /** `{1}`-style markers in `text` place numbered sidenotes, taken in order from `notes`. */
  | { kind: "p"; text: string; notes?: string[] }
  | { kind: "h"; text: string }
  | { kind: "table"; caption: string; head: string[]; rows: string[][] }
  | { kind: "figure"; publicationId: string; caption: string }
  | { kind: "plates"; publicationIds: string[] };

export type Note = {
  slug: string;
  title: string;
  /** "YYYY-MM-DD" when the exact day is known, otherwise "YYYY-MM". */
  date: string;
  summary: string;
  /** Headpiece image and its accent, which also colours the drop cap. */
  banner: string;
  bannerAlt: string;
  accent: string;
  blocks: NoteBlock[];
  sources: { label: string; href: string }[];
};
