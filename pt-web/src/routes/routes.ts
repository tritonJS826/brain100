export const PATHS = {
  HOME: "/" as const,
  ABOUT: "/about" as const,

  MENTAL_HEALTH: {
    LIST: "/mental-health" as const,
    DETAIL: "/mental-health/:slug" as const,
  },

  DIAGNOSTICS: {
    LIST: "/diagnostics" as const,
    DETAIL: "/diagnostics/:slug" as const,
  },

  BIOHACKING: {
    LIST: "/biohacking" as const,
    DETAIL: "/biohacking/:slug" as const,
  },

  SUPPORT: {
    LIST: "/support" as const,
    DETAIL: "/support/:slug" as const,
  },

  SPECIALISTS: {
    LIST: "/specialists" as const,
    DETAIL: "/specialists/:id" as const,
  },

  PROFILE: {
    PAGE: "/profile" as const,
    TESTS: "/profile/tests" as const,
    SETTINGS: "/profile/settings" as const,
  },

  CONTACTS: "/contacts" as const,

  ADMIN: {
    PAGE: "/admin" as const,
    ARTICLES: {
      LIST: "/admin/articles" as const,
      CREATE: "/admin/articles/create" as const,
      EDIT: "/admin/articles/:id/edit" as const,
    },
    TESTS: {
      LIST: "/admin/tests" as const,
      CREATE: "/admin/tests/create" as const,
      EDIT: "/admin/tests/:id/edit" as const,
    },
  },

  NOT_FOUND: "*" as const,
} as const;

export const buildPath = {
  mentalHealthList: () => PATHS.MENTAL_HEALTH.LIST,
  diagnosticsList: () => PATHS.DIAGNOSTICS.LIST,
  biohackingList: () => PATHS.BIOHACKING.LIST,
  supportList: () => PATHS.SUPPORT.LIST,
  specialistsList: () => PATHS.SPECIALISTS.LIST,

  mentalHealthDetail: (slug: string) => `/mental-health/${slug}`,
  diagnosticsDetail: (slug: string) => `/diagnostics/${slug}`,
  biohackingDetail: (slug: string) => `/biohacking/${slug}`,
  supportDetail: (slug: string) => `/support/${slug}`,
  specialistDetail: (id: string | number) => `/specialists/${id}`,

  about: () => PATHS.ABOUT,
  contacts: () => PATHS.CONTACTS,

  profilePage: () => PATHS.PROFILE.PAGE,
  profileTests: () => PATHS.PROFILE.TESTS,
  profileSettings: () => PATHS.PROFILE.SETTINGS,

  adminPage: () => PATHS.ADMIN.PAGE,
  adminArticlesList: () => PATHS.ADMIN.ARTICLES.LIST,
  adminArticleCreate: () => PATHS.ADMIN.ARTICLES.CREATE,
  adminArticleEdit: (id: string | number) => `/admin/articles/${id}/edit`,
  adminTestsList: () => PATHS.ADMIN.TESTS.LIST,
  adminTestCreate: () => PATHS.ADMIN.TESTS.CREATE,
  adminTestEdit: (id: string | number) => `/admin/tests/${id}/edit`,
} as const;
