export const PATHS = {
  HOME: "/",
  ABOUT: "/about",
  MENTAL_HEALTH: {LIST: "/mental-health", DETAIL: "/mental-health/:id"},
  TESTS: {LIST: "/tests", DETAIL: "/tests/:id"},
  BIOHACKING: {LIST: "/biohacking", DETAIL: "/biohacking/:id"},
  SOS: {LIST: "/support", DETAIL: "/support/:id", CONSULTATION: "/support/consultation"},
  PROFILE: {PAGE: "/profile", CONDITION: "/profile/condition/:id"},
  AUTH: {PAGE: "/auth"},
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

} as const;
