export const PATHS = {
  HOME: "/",
  ABOUT: "/about",
  MENTAL_HEALTH: {LIST: "/mental-health", DETAIL: "/mental-health/:id"},
  TESTS: {LIST: "/tests", DETAIL: "/tests/:id"},
  BIOHACKING: {LIST: "/biohacking", DETAIL: "/biohacking/:id"},
  SOS: {LIST: "/support", DETAIL: "/support/:id", CONSULTATION: "/support/consultation"},
  PROFILE: {PAGE: "/profile", CONDITION: "/profile/condition/:id"},
  AUTH: {PAGE: "/auth"},
  ADMIN: {
    PAGE: "/admin",
    ARTICLES: {LIST: "/admin/articles", CREATE: "/admin/articles/create", EDIT: "/admin/articles/:id/edit"},
    TESTS: {LIST: "/admin/tests", CREATE: "/admin/tests/create", EDIT: "/admin/tests/:id/edit"},
  },
  NOT_FOUND: "*",
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

  supportConsultation: () => PATHS.SOS.CONSULTATION,
  about: () => PATHS.ABOUT,

  profilePage: () => PATHS.PROFILE.PAGE,
  profileCondition: (id: string | number) => `/profile/condition/${id}`,

  auth: () => PATHS.AUTH.PAGE,

  adminPage: () => PATHS.ADMIN.PAGE,
  adminArticlesList: () => PATHS.ADMIN.ARTICLES.LIST,
  adminArticleCreate: () => PATHS.ADMIN.ARTICLES.CREATE,
  adminArticleEdit: (id: string | number) => `/admin/articles/${id}/edit`,
  adminTestsList: () => PATHS.ADMIN.TESTS.LIST,
  adminTestCreate: () => PATHS.ADMIN.TESTS.CREATE,
  adminTestEdit: (id: string | number) => `/admin/tests/${id}/edit`,
} as const;
