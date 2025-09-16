export type MenuKey =
  | "about"
  | "mental"
  | "diagnostics"
  | "biohacking"
  | "specialists"
  | "contacts";

export const TIMEOUT_MENU_MS = 10000;
export const CTA_TEXT = "Поддержка";

export const LEFT_LINKS: ReadonlyArray<{ key: MenuKey; label: string }> = [
  {key: "about", label: "О проекте"},
  {key: "mental", label: "Состояния и эмоции"},
  {key: "diagnostics", label: "Диагностика"},
  {key: "biohacking", label: "Здоровье и энергия"},
];

export const RIGHT_LINKS: ReadonlyArray<{ key: MenuKey; label: string }> = [
  {key: "specialists", label: "Специалисты"},
  {key: "contacts", label: "Контакты"},
];

export const MENTAL_ITEMS: ReadonlyArray<{ slug: string; label: string }> = [
  {slug: "panic-attack", label: "Паническая атака"},
  {slug: "anxiety", label: "Тревога"},
  {slug: "depression", label: "Депрессия"},
  {slug: "burnout", label: "Выгорание"},
];

export const DIAGNOSTIC_TESTS: ReadonlyArray<{ slug: string; label: string }> =
  [
    {slug: "phq-9", label: "PHQ-9 (депрессия)"},
    {slug: "gad-7", label: "GAD-7 (тревога)"},
    {slug: "who-wellbeing", label: "WHO-5 (благополучие)"},
  ];

export const BIOHACKING_ARTICLES: ReadonlyArray<{
  slug: string;
  label: string;
}> = [
  {slug: "sleep-hygiene", label: "Гигиена сна"},
  {slug: "nutrition-focus", label: "Питание и энергия"},
  {slug: "breathing", label: "Дыхательные практики"},
];
