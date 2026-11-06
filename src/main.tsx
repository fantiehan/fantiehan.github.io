import { playOpening } from "@/opening/opening";

// The site's code loads separately so that the opening can stand in for it while it downloads.
playOpening(import("./boot").then(({ boot }) => boot()));
