export type QuestionType = "radio" | "checkbox" | "text";

export type Question = {
  id: number;
  scale: string;
  type: QuestionType;
  question: string;
  options?: string[];
  scores?: number[];
  placeholder?: string;
  nextId?: number;
  skipIfAnswer?: string;
};

export type Test = {
  id: string;
  name: string;
  description: string;
  questions: Question[];
};
