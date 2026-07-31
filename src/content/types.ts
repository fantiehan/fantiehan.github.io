export type PublicationType = "conference" | "journal";

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
  imageUrl?: string;
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
  interests: string;
  citationsLabel: string;
  email: string;
  scholarUrl: string;
  intro: string[];
};
