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

  ABOUT: "/about" as const,

  MENTAL_HEALTH: {
    ROOT: "/mental-health" as const,
    DETAIL: "/mental-health/:slug" as const,
  },

  DIAGNOSTICS: {
    ROOT: "/diagnostics" as const,
    TEST: "/diagnostics/:slug" as const,
  },

  BIOHACKING: {
    ROOT: "/biohacking" as const,
    ARTICLE: "/biohacking/:slug" as const,
  },

  SPECIALIST: "/about-me" as const,

  CONTACTS: "/contacts" as const,

  ADMIN: {
    ROOT: "/admin" as const,
    ARTICLES: {
      ROOT: "/admin/articles" as const,
      CREATE: "/admin/articles/create" as const,
      EDIT: "/admin/articles/:id/edit" as const,
    },
    TESTS: {
      ROOT: "/admin/tests" as const,
      CREATE: "/admin/tests/create" as const,
      EDIT: "/admin/tests/:id/edit" as const,
    },
  },

  NOT_FOUND: "*" as const,
} as const;

export const buildPath = {
  mentalHealthRoot: () => PATHS.MENTAL_HEALTH.ROOT,
  diagnosticsRoot: () => PATHS.DIAGNOSTICS.ROOT,
  biohackingRoot: () => PATHS.BIOHACKING.ROOT,

  mentalHealthDetail: (slug: string) => `/mental-health/${slug}`,
  test: (slug: string) => `/diagnostics/${slug}`,
  article: (slug: string) => `/biohacking/${slug}`,

  specialist: () => PATHS.SPECIALIST,
  contacts: () => PATHS.CONTACTS,

  adminRoot: () => PATHS.ADMIN.ROOT,
  adminArticles: () => PATHS.ADMIN.ARTICLES.ROOT,
  adminArticleCreate: () => PATHS.ADMIN.ARTICLES.CREATE,
  adminArticleEdit: (id: string | number) => `/admin/articles/${id}/edit`,
  adminTests: () => PATHS.ADMIN.TESTS.ROOT,
  adminTestCreate: () => PATHS.ADMIN.TESTS.CREATE,
  adminTestEdit: (id: string | number) => `/admin/tests/${id}/edit`,

  anchor: (hash: typeof ANCHORS[keyof typeof ANCHORS]) => `/${hash}`,
  anchorHome: () => `/${ANCHORS.HOME}`,
  anchorAbout: () => `/${ANCHORS.ABOUT}`,
  anchorMentalHealth: () => `/${ANCHORS.MENTAL_HEALTH}`,
  anchorDiagnostics: () => `/${ANCHORS.DIAGNOSTICS}`,
  anchorBiohacking: () => `/${ANCHORS.BIOHACKING}`,
  anchorAboutMe: () => `/${ANCHORS.ABOUT_ME}`,
  anchorContacts: () => `/${ANCHORS.CONTACTS}`,
} as const;
