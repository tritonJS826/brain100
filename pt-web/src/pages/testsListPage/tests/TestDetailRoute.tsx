import {useParams} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {NotFoundPage} from "src/pages/notFoundPage/NotFoundPage";
import {TestStartPage} from "src/pages/testsListPage/tests/TestStartPage";

export function TestDetailRoute() {
  const {id} = useParams<{ id: string }>();
  const dictionary = useDictionary(DictionaryKey.TESTS) as {
    startPageData: Record<string, unknown>;
  } | null;

  const isValidTestId = id && dictionary && id in dictionary.startPageData;

  return isValidTestId ? <TestStartPage /> : <NotFoundPage />;
}
