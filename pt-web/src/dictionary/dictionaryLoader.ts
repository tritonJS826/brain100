import type {HomeDictEn} from "src/dictionary/dictionaries/home/home.en";
import type {HomeDictRu} from "src/dictionary/dictionaries/home/home.ru";

export enum DictionaryKey {
  HOME = "home",
}

export type Language = "en" | "ru";

export type DictionaryMap = {
  [DictionaryKey.HOME]: HomeDictEn | HomeDictRu;
  // Add more dict types here
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
};

export async function loadDictionary<K extends DictionaryKey>(
  key: K,
  lang: Language,
): Promise<DictionaryMap[K]> {
  return loaders[key][lang]();
}
