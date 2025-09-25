import {useState} from "react";
import {Link} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/articlesListPage/ArticlesListPage.module.scss";

export function ArticlesListPage() {
  const dictionary = useDictionary(DictionaryKey.MENTAL);
  const [q, setQ] = useState("");

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  const filtered = query
    ? dictionary.items.filter(index =>
      [index.title, index.subtitle ?? "", index.excerpt ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
    : dictionary.items;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="articles-title"
    >
      <header className={styles.head}>
        <h1
          id="articles-title"
          className={styles.title}
        >
          {dictionary.title}
        </h1>
        <p className={styles.subtitle}>
          {dictionary.subtitle}
        </p>
        <div className={styles.toolbar}>
          <input
            type="search"
            value={q}
            placeholder={dictionary.searchPlaceholder}
            onChange={(e) => setQ(e.target.value)}
            className={styles.search}
            aria-label={dictionary.ariaSearchLabel}
          />
        </div>
      </header>

      <ul className={styles.grid}>
        {filtered.map(item => (
          <li
            key={item.id}
            className={styles.card}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                <Link
                  to={buildPath.mentalHealthDetail(item.id)}
                  className={styles.cardLink}
                >
                  {item.title}
                </Link>
              </h2>
              {item.subtitle && <p className={styles.cardSubtitle}>
                {item.subtitle}
              </p>}
              {item.excerpt && <p className={styles.cardText}>
                {item.excerpt}
              </p>}
            </div>
            <div className={styles.cardFoot}>
              <Link
                to={buildPath.mentalHealthDetail(item.id)}
                className={styles.btn}
              >
                {dictionary.cta}
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            {dictionary.empty}
          </p>
        </div>
      )}
    </section>
  );
}
