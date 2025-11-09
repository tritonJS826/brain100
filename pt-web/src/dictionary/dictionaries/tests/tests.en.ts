/* eslint-disable max-len */
export const testsDict = {
  title: "Test Catalog",
  subtitle: "A selection of validated questionnaires for self-assessment. The results are not a diagnosis.",
  searchPlaceholder: "Search for a test…",
  ariaSearchLabel: "Search by test name",
  foundPrefix: "Found:",
  cta: "Take the test",
  empty: "Nothing found. Try a different search.",
  tests: [
    {id: "main", name: "Main Psychological Test"},
    {id: "2", name: "Mood Test"},
    {id: "3", name: "Anxiety Level Test"},
    {id: "4", name: "Stress Profile"},
  ] as const,

  startPageData: {
    main: {
      title: "Main Psychological Test",
      subtitle: "This test will help you better understand your condition and determine the most helpful actions.",
      description:
        "Your answers will help identify key aspects of emotional and mental well-being and track changes over time. All data is kept confidential.",
      button: "Start Test",
    },
    2: {
      title: "Mood Test",
      subtitle: "Helps assess your current emotional state and detect mood swings.",
      description:
        "Answer a few simple questions to understand how your mood changes over time. The results can help identify signs of low mood or increased irritability.",
      button: "Start Test",
    },
    3: {
      title: "Anxiety Level Test",
      subtitle: "Find out how much anxiety you experience in daily life.",
      description:
        "This test evaluates your level of anxiety and tension, helping detect signs of anxiety disorders and how much stress affects your emotional state.",
      button: "Take the Test",
    },
    4: {
      title: "Stress Profile",
      subtitle: "Assess how you respond to stress and how resilient you are to external pressure.",
      description:
        "This test will help determine your stress level, how well you handle difficult situations, and offer recommendations to improve resilience.",
      button: "Start Test",
    },
  },

  resultPage: {
    resultTitle: "Your Result",
    resultCode: "S-scale Code:",
    scalePointsTitle: "Scores by scales:",
    loading: "Processing your result...",
  },
  questionPage: {
    backToAll: "← Back to all tests",
    questionPrefix: "Question",
    of: "of",
    mainTestTitle: "Main Test",
    chooseOptionHint: "Please select one of the options to continue.",
    answerButton: "Submit answer",
  },
  default: {
    title: "Test",
    subtitle: "Take the test to learn more about yourself.",
    description: "Your answers will be stored anonymously.",
    button: "Start Test",
  },
} as const;

export type TestsDictEn = typeof testsDict;
