import {useState} from "react";
import {Link} from "react-router-dom";
import {Button} from "src/components/Button/Button";
import {EmptyState} from "src/components/EmptyState/EmptyState";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import {filterBySearch} from "src/utils/filterBySearch";
import styles from "src/pages/articlesListPage/ArticlesListPage.module.scss";

type ArticleItem = {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
};

type ArticlesDictionary = {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  ariaSearchLabel: string;
  cta: string;
  empty: string;
  articles: ArticleItem[];
};

export function ArticlesListPage() {
  const dictionary = useDictionary(DictionaryKey.MENTAL) as ArticlesDictionary | null;
  const [searchQuery, setSearchQuery] = useState("");

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const filteredArticles = filterBySearch<ArticleItem>(
    dictionary.articles,
    searchQuery,
    (item) => [item.title, item.subtitle ?? "", item.excerpt ?? ""].join(" "),
  );

  return (
    <section
      className={styles.wrap}
      aria-labelledby="articles-title"
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
        {filteredArticles.map((item) => (
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
              {item.subtitle && (
                <p className={styles.cardSubtitle}>
                  {item.subtitle}
                </p>
              )}
              {item.excerpt && (
                <p className={styles.cardText}>
                  {item.excerpt}
                </p>
              )}
            </div>
            <div className={styles.cardFoot}>
              <Button to={buildPath.mentalHealthDetail(item.id)}>
                {dictionary.cta}
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {filteredArticles.length === 0 && (
        <EmptyState message={dictionary.empty} />
      )}
    </section>
  );
}
