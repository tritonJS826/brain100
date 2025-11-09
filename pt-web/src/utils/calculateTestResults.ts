import {getDefaultStore} from "jotai";
import {mainTestScaleS} from "src/pages/testsListPage/tests/scaleS";
import {mainTestAtom} from "src/pages/testsListPage/tests/TestMainPage";

type Answers = {[questionId: number]: number};
type Result = {[scale: string]: number};

const POSITIVE_SCORE = 1;

export function calculateMainTestResults(answers: Answers): Result {
  const store = getDefaultStore();
  const test = store.get(mainTestAtom);
  const result: Result = {};

  for (const question of test.questions) {
    const answerScore = answers[question.id] ?? 0;
    const scale = question.scale;

    result[scale] = (result[scale] || 0) + answerScore;
  }

  return result;
}

export function calculateScaleS(answers: Answers): number {
  let S = 0;

  for (const block of mainTestScaleS.blocks) {
    let i = 0;

    for (const q of block.questions) {
      if (answers[q.id] === POSITIVE_SCORE) {
        i++;
      }
    }

    const condition = block.result.condition.replace(/i/g, i.toString());

    if (eval(condition)) {
      S += block.result.addToS;
    } else {
      S += block.result.elseAddToS;
    }
  }

  return S;
}
