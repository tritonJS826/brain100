import {tests} from "src/pages/tests/tests.mock";
import type {Test} from "src/pages/tests/tests.types";

export async function loadTestById(testId: string): Promise<Test> {
  return Promise.resolve(tests[testId]);
}

export async function loadTestsIndex(): Promise<Array<Pick<Test, "id" | "name">>> {
  return Promise.resolve(Object.values(tests).map(test => ({id: test.id, name: test.name})));
}
