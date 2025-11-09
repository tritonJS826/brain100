import {atom} from "jotai";
import {MainTestEn} from "src/dictionary/dictionaries/tests/mainTest.en";
import {MainTestRu} from "src/dictionary/dictionaries/tests/mainTest.ru";
import {languageAtom} from "src/dictionary/dictionaryAtom";

export const mainTestAtom = atom(get => {
  const lang = get(languageAtom);

  return lang === "ru" ? MainTestRu : MainTestEn;
});

export const mainTestQuestionsAtom = atom(get => get(mainTestAtom).questions);
