import { create } from "zustand";

type MastheadState = {
  /** True while the home page signature is on screen, so the nav need not repeat the name. */
  signatureVisible: boolean;
  setSignatureVisible: (visible: boolean) => void;
  /** True while the pencil is writing the signature, so the margin pencil waits its turn. */
  signing: boolean;
  setSigning: (signing: boolean) => void;
};

// The site uses hash routing and pages open scrolled to the top, so a first load of Home starts with
// the signature in view. Seeding this avoids flashing the name before the observer reports.
const startsOnHome = ["", "#", "#/"].includes(window.location.hash);

export const useMasthead = create<MastheadState>((set) => ({
  signatureVisible: startsOnHome,
  setSignatureVisible: (signatureVisible) => set({ signatureVisible }),
  signing: false,
  setSigning: (signing) => set({ signing }),
}));
