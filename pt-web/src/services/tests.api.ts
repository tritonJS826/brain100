import {tests} from "src/pages/tests/tests.mock";

export interface TextQuestion {
    id: number;
    type: "text";
    question: string;
    placeholder: string;
  }

export interface RadioQuestion {
    id: number;
    type: "radio";
    question: string;
    options: string[];
  }

export interface CheckboxQuestion {
    id: number;
    type: "checkbox";
    question: string;
    options: string[];
  }

export type Question = TextQuestion | RadioQuestion | CheckboxQuestion;

export interface Test {
    id: string;
    name: string;
    questions: Question[];
  }

export async function loadTestById(testId: string): Promise<Test> {
  return Promise.resolve(tests[testId]);
}

export async function loadTestsIndex(): Promise<Array<Pick<Test, "id" | "name">>> {
  return Promise.resolve(Object.values(tests).map(test => ({id: test.id, name: test.name})));
}
