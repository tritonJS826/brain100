export const home = {
  hero: {
    title: "Start your journey to sustainable calm.",
    subtitle: "Resources, tests, and specialists — all in one place, with a focus on gentle support.",
    benefits: [
      "Short diagnostics and personalized recommendations",
      "Consultations with specialists at a convenient time",
      "Clear articles about conditions and self-help",
      "Practices for restoring energy",
    ] as const,
  },
};

export type HomeDictEn = typeof home;
