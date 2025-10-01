import {Link} from "react-router-dom";
import {Button} from "src/components/Button/Button";
import {EmptyState} from "src/components/EmptyState/EmptyState";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/biohackingListPage/BiohackingListPage.module.scss";

type BioItem = {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  img?: string;
};

type BioDictionary = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ariaSearchLabel: string;
  cta: string;
  empty: string;
  articlesItems: BioItem[];
};

export function BiohackingListPage() {
  const dictionary = useDictionary(DictionaryKey.BIOHACKING) as BioDictionary | null;

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const items = dictionary.articlesItems;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="bio-title"
    >
      <PageHeader
        title={dictionary.title}
        subtitle={dictionary.subtitle}
      />

      <ul className={styles.grid}>
        {items.map((item) => (
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
              <Button to={buildPath.biohackingDetail(item.id)}>
                {dictionary.cta}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {items.length === 0 && <EmptyState message={dictionary.empty} />}
    </section>
  );
}
