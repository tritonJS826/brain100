import {useEffect, useState} from "react";
import styles from "src/pages/tests/Test.module.scss";

interface TextQuestion {
  id: number;
  type: "text";
  question: string;
  placeholder: string;
}

interface RadioQuestion {
  id: number;
  type: "radio";
  question: string;
  options: string[];
}

interface CheckboxQuestion {
  id: number;
  type: "checkbox";
  question: string;
  options: string[];
};

type Question = TextQuestion | RadioQuestion | CheckboxQuestion

interface Test {
  id: string;
  name: string;
  questions: Question[];
}

/*
  / @Key - test id,
  / @value - test details
 */
const tests: Record<string, Test> = {
  "1": {
    id: "1",
    name: "Тест о депрессии",
    questions: [
      {
        id: 1,
        type: "text",
        question: "Как вы спали прошлой ночью?",
        placeholder: "Например: хорошо / 7 часов",
      }, {
        id: 2,
        type: "checkbox",
        question: "Что помогало сегодня? (можно несколько)",
        options: [
          "Сон",
          "Прогулка",
          "Разговор с близким",
          "Упражнения",
        ],
      }, {
        id: 3,
        type: "radio",
        question: "Настроение сейчас",
        options: [
          "Спокойное",
          "Напряжённое",
          "Радостное",
        ],
      },
    ],
  },
};

async function loadTest(testId: string): Promise<Test> {
  return Promise.resolve(tests[testId]);
}

/**
 * Remove this variable later and use params or id from back
 */
const TEMPORAL_TEST_ID = "1";

async function loadData<T extends object>(
  callback: () => Promise<T>,
  callbackHandler: (param: T) => void) {
  const response = await callback();

  callbackHandler(response);
}

const INCREMENT = 1;

// String - for inputText, inputRadio
// string[] - for inputCheckbox
type Answer = string | string[]

// TODO: move to utils
function toggleStringInArray(arr: string[], string: string) {
  const index = arr.indexOf(string); // Check if the string exists in the array

  const NOT_EXISTENT_INDEX = -1;
  if (index === NOT_EXISTENT_INDEX) {
    // If the string is not found, add it to the array
    return [...arr, string]; // Returns a new array with the string added
  } else {
    // If the string is found, remove it from the array
    return arr.filter(item => item !== string); // Returns a new array with the string removed
  }
}

export function Test() {
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [test, setTest] = useState<Test>();

  const setupStates = (testFromBack: Test) => {
    const emptyAnswers: Answer[] = testFromBack.questions.map(question => {
      switch (question.type) {
        case "checkbox":
          return [];
        case "radio":
          return "";
        case "text":
          return "";
      }

    });

    setUserAnswers(emptyAnswers);
    setTest(testFromBack);
  };

  useEffect(() => {
    loadData(
      () => loadTest(TEMPORAL_TEST_ID),
      setupStates,
    );
  }, []);

  const handleSubmit = () => {

    /**
     * TODO: finish form handling
     */
    // alert("Отправлено!");
    // eslint-disable-next-line no-console
    console.log(userAnswers);
  };

  const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number) => {
    const newAnswer = e.target.value;
    const isCheckbox = e.target.type === "checkbox";

    const newAnswers = userAnswers.map((answer, i) => {
      // Skip other answers
      if (i !== questionIndex) {
        return answer;
      }

      // Handle checkboxes groups
      if (isCheckbox) {
        if (!Array.isArray(answer)) {
          throw new Error("Wrong type! Should be array");
        }

        const newAnswerArray = toggleStringInArray(Array.from(answer), newAnswer);

        return newAnswerArray;
      }

      // For radioInput and textInput
      return newAnswer;
    });

    setUserAnswers(newAnswers);
  };

  const isRadioAnswered = (answerIndex: number, option: string) => {
    return userAnswers[answerIndex] === option;
  };

  const isCheckboxAnswered = (answerIndex: number, option: string) => {
    return userAnswers[answerIndex].includes(option);
  };

  if (test === undefined) {
    return (
      <>
        ...Loading...
      </>
    );
  }

  return (
    <>
      <h2 className={styles.testName}>
        {test.name}
      </h2>
      <form className={styles.form}>
        {/* Add empty state handling - spinner or etc */}
        {test.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className={styles.block}
          >
            <label className={styles.label}>
              <span className={styles.num}>
                {/* render ordered list */}
                {questionIndex + INCREMENT}
                .
              </span>
              {question.question}
            </label>

            {question.type === "text" && (
              <input
                className={styles.textInput}
                type="text"
                name={String(question.id)}
                placeholder={question.placeholder}
                value={userAnswers[questionIndex]}
                onChange={(e) => handelInputChange(e, questionIndex)}
              />
            )}

            {question.type === "radio" && (
              <div className={styles.options}>
                {question.options.map(option => (
                  <label
                    key={option}
                    className={styles.option}
                  >
                    <input
                      className={styles.radio}
                      type="radio"
                      name={String(question.id)}
                      value={option}
                      checked={isRadioAnswered(questionIndex, option)}
                      onChange={(e) => handelInputChange(e, questionIndex)}
                    />
                    <span className={styles.optionText}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {question.type === "checkbox" && (
              <div className={styles.options}>
                {question.options.map(option => (
                  <label
                    key={option}
                    className={styles.option}
                  >
                    <input
                      className={styles.checkbox}
                      type="checkbox"
                      name={String(question.id)}
                      value={option}
                      checked={isCheckboxAnswered(questionIndex, option)}
                      onChange={(e) => handelInputChange(e, questionIndex)}
                    />
                    <span className={styles.optionText}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          type="button"
          className={styles.submit}
          onClick={handleSubmit}
        >
          Отправить
        </button>
      </form>
    </>
  );
}
