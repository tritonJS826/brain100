// Src/hooks/useDictionary.ts
import {useEffect, useState} from "react";
import {DictionaryKey, DictionaryMap, Language, loadDictionary} from "src/dictionary/dictionaryLoader";

export function useDictionary<K extends DictionaryKey>(
  key: K,
  lang: Language,
) {
  const [dict, setDict] =
    useState<null | DictionaryMap[K]>(null);

  useEffect(() => {
    let active = true;
    loadDictionary(key, lang).then((dictionary) => {
      if (active) {
        setDict(dictionary);
      }
    });

    return () => {
      active = false;
    };
  }, [key, lang]);

  return dict;
}
