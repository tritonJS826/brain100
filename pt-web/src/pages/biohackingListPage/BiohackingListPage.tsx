import {useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "src/components/Button/Button";
import {EmptyState} from "src/components/EmptyState/EmptyState";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import {filterBySearch} from "src/utils/filterBySearch";
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
  const [searchQuery, setSearchQuery] = useState("");

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const filteredItems = filterBySearch<BioItem>(
    dictionary.articlesItems,
    searchQuery,
    (item) => [item.title, item.subtitle ?? "", item.excerpt ?? ""].join(" "),
  );

  return (
    <section
      className={styles.wrap}
      aria-labelledby="bio-title"
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
        {filteredItems.map((item) => (
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

      {filteredItems.length === 0 && <EmptyState message={dictionary.empty} />}
    </section>
  );
}
