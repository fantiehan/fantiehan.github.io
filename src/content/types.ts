export type PublicationType = "conference" | "journal";

export type ContributionTag = "First Author" | "Co-First Author" | "";

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
};

export type TimelineItem = {
  range: string;
  title: string;
  subtitle?: string;
  details: string[];
  icon?: "university" | "company";
};

export type Profile = {
  name: string;
  headline: string;
  interests: string;
  citationsLabel: string;
  email: string;
  scholarUrl: string;
};
