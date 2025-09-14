export const ANCHORS = {
  HOME: "#home",
  ABOUT: "#about",
  MENTAL_HEALTH: "#mental-health",
  DIAGNOSTICS: "#diagnostics",
  BIOHACKING: "#biohacking",
  ABOUT_ME: "#about-me",
  CONTACTS: "#contacts",
} as const;

export const PATHS = {
  HOME: "/" as const,
  ABOUT_PROJECT: "/about-project" as const,

  MENTAL_HEALTH: {
    ROOT: "/mental-health" as const,
    DETAIL: "/mental-health/:slug" as const,
  },

  DIAGNOSTICS: {
    ROOT: "/diagnostics" as const,
    TEST: "/diagnostics/:slug" as const,
    RESULTS: "/diagnostics/results/:id" as const,
  },

  BIOHACKING: {
    ROOT: "/biohacking" as const,
    ARTICLE: "/biohacking/:slug" as const,
  },

  SPECIALIST: "/about-me" as const,

  CONTACTS: "/contacts" as const,

  NOT_FOUND: "*" as const,
} as const;

export const buildPath = {
  mentalHealthRoot: () => PATHS.MENTAL_HEALTH.ROOT,
  diagnosticsRoot: () => PATHS.DIAGNOSTICS.ROOT,
  biohackingRoot: () => PATHS.BIOHACKING.ROOT,

  mentalHealthDetail: (slug: string) => `/mental-health/${slug}`,
  test: (slug: string) => `/diagnostics/${slug}`,
  diagnosticsResults: (id: string | number) => `/diagnostics/results/${id}`,
  article: (slug: string) => `/biohacking/${slug}`,

  specialist: () => PATHS.SPECIALIST,
  contacts: () => PATHS.CONTACTS,

  anchor: (hash: typeof ANCHORS[keyof typeof ANCHORS]) => `/${hash}`,
  anchorContacts: () => `/${ANCHORS.CONTACTS}`,
  anchorAbout: () => `/${ANCHORS.ABOUT}`,
  anchorDiagnostics: () => `/${ANCHORS.DIAGNOSTICS}`,
  anchorMentalHealth: () => `/${ANCHORS.MENTAL_HEALTH}`,
  anchorBiohacking: () => `/${ANCHORS.BIOHACKING}`,
  anchorAboutMe: () => `/${ANCHORS.ABOUT_ME}`,
} as const;
