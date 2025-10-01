export const PATHS = {
  HOME: "/" as const,
  ABOUT: "/about" as const,

  MENTAL_HEALTH: {
    LIST: "/mental-health" as const,
    DETAIL: "/mental-health/:id" as const,
  },

  TESTS: {
    LIST: "/tests" as const,
    DETAIL: "/tests/:id" as const,
  },

  BIOHACKING: {
    LIST: "/biohacking" as const,
    DETAIL: "/biohacking/:id" as const,
  },

  SOS: {
    LIST: "/support" as const,
    DETAIL: "/support/:id" as const,
    CONSULTATION: "/support/consultation" as const,
  },

  PROFILE: {
    PAGE: "/profile" as const,
    SETTINGS: "/profile/settings" as const,
  },

  AUTH: {PAGE: "/auth" as const},

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
  testsList: () => PATHS.TESTS.LIST,
  biohackingList: () => PATHS.BIOHACKING.LIST,
  supportList: () => PATHS.SOS.LIST,

  mentalHealthDetail: (id: string | number) => `/mental-health/${id}`,
  testsDetail: (id: string | number) => `/tests/${id}`,
  biohackingDetail: (id: string | number) => `/biohacking/${id}`,
  supportDetail: (id: string | number) => `/support/${id}`,
  specialistDetail: (id: string | number) => `/specialists/${id}`,

  supportConsultation: () => PATHS.SOS.CONSULTATION,

  about: () => PATHS.ABOUT,

  profilePage: () => PATHS.PROFILE.PAGE,
  profileSettings: () => PATHS.PROFILE.SETTINGS,

  auth: () => PATHS.AUTH.PAGE,

  adminPage: () => PATHS.ADMIN.PAGE,
  adminArticlesList: () => PATHS.ADMIN.ARTICLES.LIST,
  adminArticleCreate: () => PATHS.ADMIN.ARTICLES.CREATE,
  adminArticleEdit: (id: string | number) => `/admin/articles/${id}/edit`,
  adminTestsList: () => PATHS.ADMIN.TESTS.LIST,
  adminTestCreate: () => PATHS.ADMIN.TESTS.CREATE,
  adminTestEdit: (id: string | number) => `/admin/tests/${id}/edit`,
} as const;
