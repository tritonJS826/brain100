export type MenuKey =
  | "about"
  | "mental"
  | "diagnostics"
  | "biohacking";

export const TIMEOUT_MENU_MS = 10000;
export const CTA_TEXT = "SOS";

export const LEFT_LINKS: ReadonlyArray<{ key: MenuKey; label: string }> = [
  {key: "about", label: "О нас"},
  {key: "mental", label: "Состояния"},
  {key: "diagnostics", label: "Тесты"},
  {key: "biohacking", label: "Биохакинг"},
];

export const RIGHT_LINKS: ReadonlyArray<{ key: never; label: never }> = [];

export const MENTAL_ITEMS: ReadonlyArray<{ id: string; label: string }> = [
  {id: "panic-attack", label: "Паническая атака"},
  {id: "anxiety", label: "Тревога"},
  {id: "depression", label: "Депрессия"},
  {id: "burnout", label: "Выгорание"},
];

export const DIAGNOSTIC_TESTS: ReadonlyArray<{ id: string; label: string }> = [
  {id: "1", label: "Тест на наличие депрессии"},
  {id: "2", label: "Тест о настроении"},
];

export const BIOHACKING_ARTICLES: ReadonlyArray<{ id: string; label: string }> = [
  {id: "sleep-hygiene", label: "Гигиена сна"},
  {id: "nutrition-focus", label: "Питание и энергия"},
  {id: "breathing", label: "Дыхательные практики"},
];
