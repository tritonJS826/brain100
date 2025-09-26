/* eslint-disable max-len */
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
          "Sleep is the foundation of recovery. A few steady habits improve sleep depth and daytime performance.",
      content: [
        {
          type: "paragraph",
          text: "A consistent sleep schedule helps your nervous system shift into recovery and maintain balance. When you go to bed and wake up at the same time every day, your body learns when to release hormones like melatonin in the evening to help you fall asleep, and cortisol in the morning to help you wake up. This rhythm reduces stress on your nervous system and allows you to spend more time in the deep, restorative stages of sleep.",
        },
        {
          type: "paragraph",
          text: "Irregular sleep patterns, such as staying up late on weekends or catching up on sleep with long naps, can confuse your internal clock. This often leads to feeling groggy in the morning, trouble focusing during the day, and restless sleep at night. Over time, inconsistency may contribute to weakened immune function, higher stress levels, and slower recovery after both physical and mental effort.",
        },
        {
          type: "paragraph",
          text: "By sticking to a schedule, you create stability for your brain and body. It’s like training your nervous system to know when it’s safe to rest and when it’s time to be alert. Athletes often use this strategy to improve performance, since better sleep means faster muscle recovery and sharper reaction times. But it’s just as important for anyone who wants to stay focused, calm, and energized in daily life.",
        },
        {
          type: "paragraph",
          text: "One practical way to start is by setting a “wind-down” routine an hour before your bedtime—dim the lights, step away from screens, and do something calming, such as light stretching, reading, or listening to soft music. Waking up at the same time also matters, even if you feel you didn’t get enough sleep the night before, because consistency teaches your body to adjust naturally over time.",
        },
        {
          type: "paragraph",
          text: "On weekends, it can be tempting to stay up late and sleep in, but even a difference of two or three hours can throw off your circadian rhythm and make Monday mornings harder. A good rule of thumb is to keep your bedtime and wake-up time within about 30–60 minutes of your usual schedule, no matter the day of the week.",
        },
        {
          type: "paragraph",
          text: "If you maintain this habit, you’ll likely notice improvements not only in sleep quality but also in mood, concentration, and overall resilience. Your nervous system thrives on predictability, and a stable sleep schedule is one of the simplest, most effective ways to provide it.",
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
