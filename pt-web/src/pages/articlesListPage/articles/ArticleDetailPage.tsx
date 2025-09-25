import {Link, useParams} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import styles from "src/pages/articlesListPage/articles/ArticleDetailPage.module.scss";

type ParagraphBlock = { type: "paragraph"; text: string };
type ListBlock = { type: "list"; title?: string; items: string[] };
type QuoteBlock = { type: "quote"; text: string; author?: string };
type Block = ParagraphBlock | ListBlock | QuoteBlock;

export function ArticleDetailPage() {
  const {id} = useParams<{id: string}>();
  const dictionary = useDictionary(DictionaryKey.MENTAL);

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const article = dictionary.items.find(i => i.id === id);

  if (!article) {
    return (
      <section className={styles.wrap}>
        <div className={styles.empty}>
          <p>
            {dictionary.notFound}
          </p>
          <Link
            to={PATHS.MENTAL_HEALTH.LIST}
            className={styles.btn}
          >
            {dictionary.backToAll}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article
      className={styles.wrap}
      aria-labelledby="article-title"
    >
      {/* header можно добавить при необходимости */}
      <div className={styles.content}>
        {(article.content as ReadonlyArray<Block>).map((block, i) => {
          if (block.type === "paragraph") {
            return (
              <p
                key={i}
                className={styles.p}
              >
                {block.text}
              </p>
            );
          }
          if (block.type === "list") {
            return (
              <section
                key={i}
                className={styles.listBlock}
                aria-label={block.title || dictionary.listDefaultLabel}
              >
                {block.title && <h2 className={styles.h2}>
                  {block.title}
                </h2>}
                <ul className={styles.ul}>
                  {block.items.map((it, idx) => (
                    <li
                      key={idx}
                      className={styles.li}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          if (block.type === "quote") {
            return (
              <figure
                key={i}
                className={styles.quote}
              >
                <blockquote className={styles.q}>
                  {block.text}
                </blockquote>
                {block.author && (
                  <figcaption className={styles.caption}>
                    —
                    {block.author}
                  </figcaption>
                )}
              </figure>
            );
          }

          return null;
        })}
      </div>

      {/* footer c кнопкой возврата */}
      <div style={{marginTop: "32px"}}>
        <Link
          to={PATHS.MENTAL_HEALTH.LIST}
          className={styles.btn}
        >
          {dictionary.backToAll}
        </Link>
      </div>
    </article>
  );
}
