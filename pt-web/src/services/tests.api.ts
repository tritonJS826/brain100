import {allTestsEn as testsEn} from "src/dictionary/dictionaries/tests/allTests.en";
import {allTestsRu as testsRu} from "src/dictionary/dictionaries/tests/allTests.ru";
import type {Language} from "src/dictionary/dictionaryLoader";
import type {Test} from "src/types/test";

export async function loadTestById(testId: string, lang: Language): Promise<Test> {
  const store = lang === "ru" ? testsRu : testsEn;

  return Promise.resolve(store[testId]);
}

export async function loadTestsIndex(lang: Language): Promise<Array<Pick<Test, "id" | "name">>> {
  const store = lang === "ru" ? testsRu : testsEn;

  return Promise.resolve(
    Object.values(store).map(test => ({
      id: test.id,
      name: test.name,
    })),
  );
}
