
export const supportDict = {
  title: "Поддержка",
  subtitle:
      "В экстренной ситуации звоните сразу. Далее можно отправить заявку на консультацию и почитать материалы по самопомощи.",

  emergencyTitle: "Экстренная помощь",
  emergencyCta: "Позвонить на горячую линию",

  consultationTitle: "Консультация со специалистом",
  consultationSubtitle: "Оставьте заявку, и мы свяжемся с вами для согласования времени.",
  consultationBtn: "Отправить заявку на консультацию",

  selfhelpTitle: "Самопомощь",
  selfhelpSubtitle: "Ознакомьтесь с короткими рекомендациями, чтобы помочь себе в моменте.",
  selfhelpItems: [
    {id: "panic", title: "Паническая атака", desc: "Как распознать приступ и что делать прямо сейчас.", link: "#panic-attack"},
    {id: "anxiety", title: "Тревога", desc: "Способы снизить напряжение и вернуть контроль.", link: "#anxiety"},
    {id: "depression", title: "Депрессия", desc: "Когда обращаться за помощью и базовые шаги поддержки.", link: "#depression"},
  ],

  form: {
    title: "Заявка на консультацию",
    subtitle: "Заполните форму ниже. Мы свяжемся с вами и подберём удобное время.",
    labels: {
      name: "Имя*",
      email: "Email*",
      phone: "Телефон",
      topic: "Тема запроса*",
      preferredAt: "Предпочтительное время",
      message: "Сообщение",
    },
    placeholders: {
      phone: "По желанию",
      topic: "Например: тревога, паническая атака…",
      preferredAt: "Например: после 18:00 или в выходные",
      message: "Коротко опишите запрос или задачу",
    },
    submit: "Отправить заявку",
    backToSupport: "Назад к поддержке",
    error: "Не удалось отправить заявку. Попробуйте снова.",
    sentTitle: "Заявка отправлена",
    sentTextPrefix: "Номер заявки:",
    sentTextSuffix: "Мы свяжемся с вами.",
    goHome: "На главную",
    goSupport: "В поддержку",
  },
} as const;

export type SupportDictRu = typeof supportDict;
