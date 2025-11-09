import {atom} from "jotai";
import {MainTestEn} from "src/dictionary/dictionaries/tests/mainTest.en";
import {MainTestRu} from "src/dictionary/dictionaries/tests/mainTest.ru";
import {languageAtom} from "src/dictionary/dictionaryAtom";
import type {Test} from "src/types/test";

const allTests: Record<string, { en: Test; ru: Test }> = {
  main: {
    en: MainTestEn,
    ru: MainTestRu,
  },
};

export const currentTestIdAtom = atom<keyof typeof allTests>("main");

export const currentTestAtom = atom<Test>(get => {
  const lang = get(languageAtom);
  const id = get(currentTestIdAtom);

  return allTests[id][lang];
});

export const currentTestQuestionsAtom = atom(get =>
  get(currentTestAtom).questions,
);

export const currentTestAnswersAtom = atom<{ questionId: number; answer: string }[]>([]);
