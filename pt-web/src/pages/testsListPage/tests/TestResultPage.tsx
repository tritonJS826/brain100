import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {
  accessTokenAtom,
  refreshTokenAtom,
} from "src/state/authAtom";
import {
  currentTestAnswersAtom,
  currentTestAtom,
} from "src/state/currentTestAtoms";
import {
  calculateMainTestResults,
  calculateScaleS,
} from "src/utils/calculateTestResults";
import styles from "src/pages/testsListPage/tests/TestResultPage.module.scss";

type CalculatedResults = {
  scales: Record<string, number>;
  scaleSCode: number;
};

export function TestResultPage() {
  const [answers] = useAtom(currentTestAnswersAtom);
  const [accessToken] = useAtom(accessTokenAtom);
  const [refreshToken] = useAtom(refreshTokenAtom);
  const [test] = useAtom(currentTestAtom);

  const [results, setResults] = useState<CalculatedResults | null>(null);
  const dictionary = useDictionary(DictionaryKey.TESTS)?.resultPage;

  useEffect(() => {
    const calculateAndStoreResults = async () => {
      if (!test?.questions?.length) {
        return;
      }

      const scoredAnswers: Record<number, number> = {};

      for (const {questionId, answer} of answers) {
        const question = test.questions.find(questionItem => questionItem.id === questionId);
        const score = question?.scores?.[Number(answer)];
        if (typeof score === "number") {
          scoredAnswers[questionId] = score;
        }
      }

      const scales = calculateMainTestResults(scoredAnswers);
      const scaleSCode = calculateScaleS(scoredAnswers);

      const resultPayload = {
        testId: test.id,
        sessionId: null,
        answers: Object.entries(scoredAnswers).map(([questionId, score]) => ({
          question_id: Number(questionId),
          score,
        })),
        stats: {...scales, scaleSCode},
      };

      try {
        await fetch("http://localhost:8000/save-bulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken?.token && {Authorization: `Bearer ${accessToken.token}`}),
            ...(refreshToken?.token && {"x-refresh-token": refreshToken.token}),
          },
          body: JSON.stringify(resultPayload),
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error while sending result:", error);
      }

      localStorage.setItem(`${test.id}_result`, JSON.stringify(resultPayload));
      setResults({scales, scaleSCode});
    };

    calculateAndStoreResults();
  }, [answers, test, accessToken, refreshToken]);

  if (!results) {
    return (
      <p className={styles.loading}>
        {dictionary?.loading ?? "Processing result..."}
      </p>
    );
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        {dictionary?.resultTitle ?? "Your Result"}
      </h1>

      <p className={styles.code}>
        <strong>
          {dictionary?.resultCode ?? "S-scale Code:"}
        </strong>
        {" "}
        {results.scaleSCode}
      </p>

      <h3 className={styles.subheading}>
        {dictionary?.scalePointsTitle ?? "Points by Scales:"}
      </h3>

      <ul className={styles.scalesList}>
        {Object.entries(results.scales).map(([scale, score]) => (
          <li
            key={scale}
            className={styles.scaleItem}
          >
            <strong>
              {scale}
            </strong>
            :
            {score}
          </li>
        ))}
      </ul>
    </section>
  );
}
