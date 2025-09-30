import {useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "src/components/Button/Button";
import {EmptyState} from "src/components/EmptyState/EmptyState";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import {filterBySearch} from "src/utils/filterBySearch";
import styles from "src/pages/testsListPage/TestsListPage.module.scss";

type TestItem = {
  id: string;
  name: string;
};

type TestsDictionary = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ariaSearchLabel: string;
  cta: string;
  empty: string;
  tests: TestItem[];
};

export function TestsList() {
  const dictionary = useDictionary(DictionaryKey.TESTS) as TestsDictionary | null;
  const [searchQuery, setSearchQuery] = useState("");

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const filteredTests = filterBySearch<TestItem>(
    dictionary.tests,
    searchQuery,
    test => test.name,
  );

  return (
    <section
      className={styles.wrap}
      aria-labelledby="diag-title"
    >
      <PageHeader
        title={dictionary.title}
        subtitle={dictionary.subtitle}
        searchValue={searchQuery}
        searchPlaceholder={dictionary.searchPlaceholder}
        ariaSearchLabel={dictionary.ariaSearchLabel}
        onSearchChange={setSearchQuery}
      />

      <ul className={styles.grid}>
        {filteredTests.map(test => (
          <li
            key={test.id}
            className={styles.card}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                <Link
                  to={buildPath.testsDetail(test.id)}
                  className={styles.cardLink}
                >
                  {test.name}
                </Link>
              </h2>
              <p className={styles.cardText} />
            </div>
            <div className={styles.cardFoot}>
              <Button to={buildPath.testsDetail(test.id)}>
                {dictionary.cta}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filteredTests.length === 0 && <EmptyState message={dictionary.empty} />}
    </section>
  );
}
