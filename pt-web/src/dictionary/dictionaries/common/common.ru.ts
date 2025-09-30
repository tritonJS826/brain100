export const common = {
  lang: {ru: "RU", en: "EN"},

  nav: {
    about: "О нас",
    mental: "Состояния",
    tests: "Тесты",
    biohacking: "Биохакинг",
    profile: "Личный кабинет",
    sos: "SOS",
    ariaPrimary: "Основная навигация",
    ariaMenu: "Меню",
    ariaHome: "Домой",
    ariaOpenMenu: "Открыть меню",
    ariaCloseMenu: "Закрыть меню",

    menus: {
      mental: {
        "panic-attack": "Паническая атака",
        anxiety: "Тревога",
        depression: "Депрессия",
        burnout: "Выгорание",
      },
      tests: {
        "1": "Тест на наличие депрессии",
        "2": "Тест о настроении",
      },
      biohacking: {
        "sleep-hygiene": "Гигиена сна",
        "nutrition-focus": "Питание и энергия",
        breathing: "Дыхательные практики",
      },
    },
  },

  dock: {
    allStates: "Все состояния",
    allTests: "Все тесты",
    allArticles: "Все статьи",
    takeTest: "Пройти тест",
  },

  footer: {
    ariaFooter: "Подвал сайта",
    socialsAria: "Социальные сети",
    sectionsTitle: "Разделы",
    aboutTitle: "О проекте",
    resourcesTitle: "Ресурсы",

    links: {
      about: "О нас",
      states: "Состояния",
      tests: "Тесты",
      support: "Поддержка",
      projectInfo: "Описание проекта",
      specialists: "Специалисты",
      contacts: "Контакты",
      profile: "Личный кабинет",
      statesCatalog: "Каталог статей о состояниях",
      testsCatalog: "Каталог тестов",
      biohackingCatalog: "Каталог статей на тему биохакинга",
      supportAndSos: "Поддержка и SOS",
    },

    copyright: "© 2025 BRAIN100. Бережная поддержка психического здоровья.",
  },

  buttons: {
    startTest: "Пройти тест",
    submitTest: "Отправить",
  },
} as const;

export type CommonDictRu = typeof common;
