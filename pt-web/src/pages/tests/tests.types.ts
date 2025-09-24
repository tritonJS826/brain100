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
