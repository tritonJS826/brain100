import {useState} from "react";
import {Link} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/testsListPage/testsListPage.module.scss";

export function TestsList() {
  const dict = useDictionary(DictionaryKey.TESTS);
  const [query, setQuery] = useState("");

  if (!dict) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = q ? dict.items.filter(t => t.name.toLowerCase().includes(q)) : dict.items;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="diag-title"
    >
      <header className={styles.head}>
        <h1
          id="diag-title"
          className={styles.title}
        >
          {dict.title}
        </h1>

        <p className={styles.subtitle}>
          {dict.subtitle}
        </p>

        <div className={styles.toolbar}>
          <input
            type="search"
            value={query}
            placeholder={dict.searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
            aria-label={dict.ariaSearchLabel}
          />

          <span
            className={styles.count}
            aria-live="polite"
          >
            {dict.foundPrefix}
            {" "}
            {filtered.length}
          </span>
        </div>
      </header>

      <ul className={styles.grid}>
        {filtered.map(test => (
          <li
            key={test.id}
            className={styles.card}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                <Link
                  to={buildPath.diagnosticsDetail(test.id)}
                  className={styles.cardLink}
                >
                  {test.name}
                </Link>
              </h2>
              <p className={styles.cardText}>
                {/* можно тоже хранить в словаре как descriptionById, если нужно */}
              </p>
            </div>

            <div className={styles.cardFoot}>
              <Link
                to={buildPath.diagnosticsDetail(test.id)}
                className={styles.cardBtn}
              >
                {dict.cta}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            {dict.empty}
          </p>
        </div>
      )}
    </section>
  );
}
