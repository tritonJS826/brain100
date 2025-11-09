import {useNavigate, useParams} from "react-router-dom";
import {useAtom} from "jotai";
import {Button} from "src/components/Button/Button";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import {
  currentTestAnswersAtom,
  currentTestQuestionsAtom,
} from "src/state/currentTestAtoms";
import type {Question} from "src/types/test";
import styles from "src/pages/testsListPage/tests/TestQuestionPage.module.scss";

const QUESTION_NUMBER_OFFSET = 1;

export function TestQuestionPage() {
  const {id, questionNumber} = useParams<{ id: string; questionNumber: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useAtom(currentTestAnswersAtom);
  const [questions] = useAtom(currentTestQuestionsAtom);
  const dictionary = useDictionary(DictionaryKey.TESTS)?.questionPage;

  const questionIndex =
    Number(questionNumber ?? QUESTION_NUMBER_OFFSET) - QUESTION_NUMBER_OFFSET;

  const question = questions?.[questionIndex];

  if (!questions || !question) {
    return (
      <div className={styles.wrap}>
        Loading...
      </div>
    );
  }

  const selectedAnswer = answers.find(a => a.questionId === question.id)?.answer;

  const handleSelect = (value: string) => {
    setAnswers(prev => [
      ...prev.filter(a => a.questionId !== question.id),
      {questionId: question.id, answer: value},
    ]);
  };

  const handleAnswer = () => {
    const skipAnswer = question.skipIfAnswer;
    const currentAnswer = answers.find(a => a.questionId === question.id)?.answer;

    const nextQuestionIndex = (() => {
      if (skipAnswer && currentAnswer === skipAnswer) {
        const next = (questions as Question[]).find(
          (q, idx) => idx > questionIndex && !q.skipIfAnswer,
        );

        return next ? questions.indexOf(next) : questions.length;
      }

      return questionIndex + QUESTION_NUMBER_OFFSET;
    })();

    const isLastQuestion = nextQuestionIndex >= questions.length;

    if (isLastQuestion) {
      navigate(buildPath.testsResult(id ?? ""));
    } else {
      navigate(
        buildPath.testQuestion(id ?? "", nextQuestionIndex + QUESTION_NUMBER_OFFSET),
      );
    }
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.topBar}>
        <Button to={buildPath.testsList()}>
          {dictionary?.backToAll ?? "← Back to all tests"}
        </Button>

        <div className={styles.pageHeader}>
          <h2 className={styles.title}>
            {dictionary?.questionPrefix ?? "Question"}
            {" "}
            {questionIndex + QUESTION_NUMBER_OFFSET}
            {" "}
            {dictionary?.of ?? "of"}
            {" "}
            {questions.length}
          </h2>
          <p className={styles.subtitle}>
            {dictionary?.mainTestTitle ?? "Main Test"}
          </p>
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.label}>
          {question.question}
        </p>

        <div className={styles.options}>
          {question.options?.map((option, index) => (
            <label
              key={index}
              className={styles.radioOption}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={String(index)}
                checked={selectedAnswer === String(index)}
                onChange={() => handleSelect(String(index))}
              />
              <span>
                {option}
              </span>
            </label>
          ))}
        </div>

        {selectedAnswer === undefined
          ? (
            <p className={styles.hint}>
              {dictionary?.chooseOptionHint ?? "Please select one of the options to continue."}
            </p>
          )
          : (
            <button
              className={styles.submit}
              onClick={handleAnswer}
            >
              {dictionary?.answerButton ?? "Submit answer"}
            </button>
          )}
      </div>
    </section>
  );
}
