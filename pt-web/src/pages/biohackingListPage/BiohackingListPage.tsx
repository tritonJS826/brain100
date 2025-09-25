import {useState} from "react";
import {Link} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/biohackingListPage/BiohackingListPage.module.scss";

export function BiohackingListPage() {
  const dict = useDictionary(DictionaryKey.BIOHACKING);
  const [q, setQ] = useState("");

  if (!dict) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const query = q.trim().toLowerCase();
  const filtered = query
    ? dict.items.filter(item =>
      [item.title, item.subtitle ?? "", item.excerpt ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    )
    : dict.items;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="bio-title"
    >
      <header className={styles.head}>
        <h1
          id="bio-title"
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
            value={q}
            placeholder={dict.searchPlaceholder}
            onChange={(e) => setQ(e.target.value)}
            className={styles.search}
            aria-label={dict.ariaSearchLabel}
          />
        </div>
      </header>

      <ul className={styles.grid}>
        {filtered.map(item => (
          <li
            key={item.id}
            className={styles.card}
          >
            {item.img && (
              <Link
                to={buildPath.biohackingDetail(item.id)}
                className={styles.coverLink}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className={styles.cover}
                  loading="lazy"
                />
              </Link>
            )}
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                <Link
                  to={buildPath.biohackingDetail(item.id)}
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
                to={buildPath.biohackingDetail(item.id)}
                className={styles.btn}
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
