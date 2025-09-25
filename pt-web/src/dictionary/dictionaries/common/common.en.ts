export const common = {
  lang: {ru: "RU", en: "EN"},

  nav: {
    about: "About",
    mental: "Conditions",
    diagnostics: "Tests",
    biohacking: "Biohacking",
    profile: "Profile",
    sos: "SOS",
    ariaPrimary: "Primary navigation",
    ariaMenu: "Menu",
    ariaHome: "Home",
    ariaOpenMenu: "Open menu",
    ariaCloseMenu: "Close menu",

    menus: {
      mental: {
        "panic-attack": "Panic attack",
        anxiety: "Anxiety",
        depression: "Depression",
        burnout: "Burnout",
      },
      diagnostics: {
        "1": "Depression screening",
        "2": "Mood test",
      },
      biohacking: {
        "sleep-hygiene": "Sleep hygiene",
        "nutrition-focus": "Nutrition & energy",
        breathing: "Breathing practices",
      },
    },
  },

  dock: {
    allStates: "All conditions",
    allTests: "All tests",
    allArticles: "All articles",
    takeTest: "Take a test",
  },

  footer: {
    ariaFooter: "Site footer",
    socialsAria: "Social networks",
    sectionsTitle: "Sections",
    aboutTitle: "About the project",
    resourcesTitle: "Resources",

    links: {
      about: "About us",
      states: "Conditions",
      tests: "Tests",
      support: "Support",
      projectInfo: "Project overview",
      specialists: "Specialists",
      contacts: "Contacts",
      profile: "Profile",
      statesCatalog: "Conditions catalog",
      testsCatalog: "Tests catalog",
      biohackingCatalog: "Biohacking articles",
      supportAndSos: "Support & SOS",
    },

    copyright: "© 2025 BRAIN100. Gentle mental health support.",
  },

  buttons: {
    startTest: "Take the test",
    submitTest: "Submit",
  },
} as const;

export type CommonDictEn = typeof common;
