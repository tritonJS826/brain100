export const biohackingDict = {
  title: "Biohacking Articles",
  subtitle: "Short, clear materials on health and energy",
  searchPlaceholder: "Search articles",
  ariaSearchLabel: "Search articles",
  empty: "Nothing found",
  cta: "Read",

  notFound: "Article not found",
  backToAll: "Back to all articles",
  articleEyebrow: "Article",
  back: "Back to list",
  listDefaultLabel: "List",

  items: [
    {
      id: "sleep-hygiene",
      img: "",
      title: "Sleep Hygiene: Restore Your Energy",
      subtitle: "Simple steps for quality sleep",
      excerpt:
          "Sleep is the foundation of recovery. A few steady habits improve" +
          "sleep depth and daytime performance.",
      content: [
        {
          type: "paragraph",
          text:
              "A consistent sleep schedule helps your nervous system shift" +
              "into recovery. Go to bed and wake up at the same time, even on weekends.",
        },
        {
          type: "list",
          title: "Core recommendations",
          items: [
            "Fixed bedtime and wake time",
            "Dark, cool and quiet bedroom",
            "Screen detox 60–90 minutes before bed",
            "Caffeine before 2 p.m., alcohol with caution",
            "Light evening routine: shower, reading, breathing",
          ],
        },
        {
          type: "paragraph",
          text:
              "Most people notice improvements in 10–14 days. Track how you feel and adjust the routine gradually.",
        },
        {
          type: "quote",
          text: "The quality of your day starts with the quality of your night.",
          author: "Self-care reminder",
        },
      ],
    },
  ],
} as const;

export type BiohackingDictEn = typeof biohackingDict;
