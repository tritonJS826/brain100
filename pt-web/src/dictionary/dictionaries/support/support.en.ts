
export const supportDict = {
  title: "Support",
  subtitle:
      "In an emergency, call right away. Then you can send a request for a consultation and read self-help materials.",

  emergencyTitle: "Emergency help",
  emergencyCta: "Call hotline",

  consultationTitle: "Consultation with a specialist",
  consultationSubtitle: "Leave a request, and we will contact you to arrange a time.",
  consultationBtn: "Send consultation request",

  selfhelpTitle: "Self-help",
  selfhelpSubtitle: "Check short recommendations to help yourself in the moment.",
  selfhelpItems: [
    {id: "panic", title: "Panic attack", desc: "How to recognize an attack and what to do right now.", link: "#panic-attack"},
    {id: "anxiety", title: "Anxiety", desc: "Ways to reduce tension and regain control.", link: "#anxiety"},
    {id: "depression", title: "Depression", desc: "When to seek help and basic support steps.", link: "#depression"},
  ],

  form: {
    title: "Consultation request",
    subtitle: "Fill out the form below. We’ll contact you and arrange a convenient time.",
    labels: {
      name: "Name*",
      email: "Email*",
      phone: "Phone",
      topic: "Topic*",
      preferredAt: "Preferred time",
      message: "Message",
    },
    placeholders: {
      phone: "Optional",
      topic: "For example: anxiety, panic attack…",
      preferredAt: "For example: after 6 pm or on weekends",
      message: "Briefly describe your request or task",
    },
    submit: "Send request",
    backToSupport: "Back to support",
    error: "Failed to send the request. Please try again.",
    sentTitle: "Request sent",
    sentTextPrefix: "Request number:",
    sentTextSuffix: "We will contact you.",
    goHome: "Go to homepage",
    goSupport: "Go to support",
  },
} as const;

export type SupportDictEn = typeof supportDict;
