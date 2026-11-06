let finish: () => void = () => {};

/** Resolves once the opening has finished, or at once when it does not play. */
export const openingDone = new Promise<void>((resolve) => {
  finish = resolve;
});

export function finishOpening() {
  finish();
}
