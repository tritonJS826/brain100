/* eslint-disable no-magic-numbers */
/* eslint-disable max-len */
export const mainTestScaleS = {
  id: "scaleS",
  name: "Шкала S — Особый тип личности",
  description:
      "Шкала S определяет индивидуальные предпочтения и особенности мышления. Используется специальный алгоритм подсчета баллов на основе блоков вопросов.",
  blocks: [
    {
      blockId: "S1",
      questions: [
        {
          id: 1001,
          scale: "S1",
          type: "radio",
          question:
              "Когда вы оказываетесь в новой компании, вам легко завязывать разговор с незнакомыми людьми?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1002,
          scale: "S1",
          type: "radio",
          question:
              "Вы часто инициируете встречи или мероприятия с друзьями, когда у вас появляется свободное время?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1003,
          scale: "S1",
          type: "radio",
          question:
              "Вам проще выражать свои мысли и эмоции в разговорах?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
      ],
      result: {
        condition: "i >= 2",
        addToS: 1000,
        elseAddToS: 2000,
      },
    },
    {
      blockId: "S2",
      questions: [
        {
          id: 1004,
          scale: "S2",
          type: "radio",
          question:
              "Вам легче запоминать конкретные детали окружающего мира, чем размышлять о возможных сценариях развития событий?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1005,
          scale: "S2",
          type: "radio",
          question:
              "Вы предпочитаете использовать проверенные факты и методы вместо экспериментов?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1006,
          scale: "S2",
          type: "radio",
          question:
              "Вам нравится изучать новые идеи и возможности, даже если они не имеют явного применения на данный момент?",
          options: ["Да", "Нет"],
          scores: [0, 1],
        },
      ],
      result: {
        condition: "i >= 2",
        addToS: 100,
        elseAddToS: 200,
      },
    },
    {
      blockId: "S3",
      questions: [
        {
          id: 1007,
          scale: "S3",
          type: "radio",
          question:
              "Вы обычно основываете свои решения на логических аргументах, а не на чувствах?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1008,
          scale: "S3",
          type: "radio",
          question:
              "Вы предпочитаете действовать рационально, даже если это может задеть чувства других?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1009,
          scale: "S3",
          type: "radio",
          question:
              "Вы чаще полагаетесь на свои внутренние ощущения и интуицию при принятии решений?",
          options: ["Да", "Нет"],
          scores: [0, 1],
        },
      ],
      result: {
        condition: "i >= 2",
        addToS: 10,
        elseAddToS: 20,
      },
    },
    {
      blockId: "S4",
      questions: [
        {
          id: 1010,
          scale: "S4",
          type: "radio",
          question:
              "Вы часто составляете список задач на день, чтобы ничего не забыть?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1011,
          scale: "S4",
          type: "radio",
          question:
              "Вам важно заранее знать, как будут развиваться события, чтобы подготовиться к возможным изменениям?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
        {
          id: 1012,
          scale: "S4",
          type: "radio",
          question:
              "Вы стремитесь завершить начатое, даже если оно уже неинтересно?",
          options: ["Да", "Нет"],
          scores: [1, 0],
        },
      ],
      result: {
        condition: "i >= 3",
        addToS: 1,
        elseAddToS: 2,
      },
    },
  ],
  scoringNote:
      "S складывается из кода 4-значного числа от 1111 до 2222 на основе блоков S1–S4",
};
