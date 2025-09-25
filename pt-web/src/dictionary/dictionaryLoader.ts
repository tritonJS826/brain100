// Src/dictionary/dictionaryLoader.ts
import type {CommonDictEn} from "src/dictionary/dictionaries/common/common.en";
import type {CommonDictRu} from "src/dictionary/dictionaries/common/common.ru";
import type {HomeDictEn} from "src/dictionary/dictionaries/home/home.en";
import type {HomeDictRu} from "src/dictionary/dictionaries/home/home.ru";
import type {MentalDictEn} from "src/dictionary/dictionaries/mental/mental.en";
import type {MentalDictRu} from "src/dictionary/dictionaries/mental/mental.ru";
import type {TestsDictEn} from "src/dictionary/dictionaries/tests/tests.en";
import type {TestsDictRu} from "src/dictionary/dictionaries/tests/tests.ru";

export enum DictionaryKey {
  HOME = "home",
  COMMON = "common",
  TESTS = "tests",
  MENTAL = "mental",
}

export type Language = "en" | "ru";

export type DictionaryMap = {
  [DictionaryKey.HOME]: HomeDictEn | HomeDictRu;
  [DictionaryKey.COMMON]: CommonDictEn | CommonDictRu;
  [DictionaryKey.TESTS]: TestsDictEn | TestsDictRu;
  [DictionaryKey.MENTAL]: MentalDictEn | MentalDictRu;
};

const loaders: {
  [K in DictionaryKey]: {
    [L in Language]: () => Promise<DictionaryMap[K]>;
  };
} = {
  [DictionaryKey.HOME]: {
    en: async () => (await import("./dictionaries/home/home.en")).home,
    ru: async () => (await import("./dictionaries/home/home.ru")).home,
  },
  [DictionaryKey.COMMON]: {
    en: async () => (await import("./dictionaries/common/common.en")).common,
    ru: async () => (await import("./dictionaries/common/common.ru")).common,
  },
  [DictionaryKey.TESTS]: {
    en: async () => (await import("./dictionaries/tests/tests.en")).testsDict,
    ru: async () => (await import("./dictionaries/tests/tests.ru")).testsDict,
  },
  [DictionaryKey.MENTAL]: {
    en: async () => (await import("./dictionaries/mental/mental.en")).mentalDict,
    ru: async () => (await import("./dictionaries/mental/mental.ru")).mentalDict,
  },
};

export async function loadDictionary<K extends DictionaryKey>(
  key: K,
  lang: Language,
): Promise<DictionaryMap[K]> {
  return loaders[key][lang]();
}
