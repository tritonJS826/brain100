import {Link, useParams} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import styles from "src/pages/biohackingListPage/articles/BiohackingDetailPage.module.scss";

type ParagraphBlock = { type: "paragraph"; text: string };
type ListBlock = { type: "list"; title?: string; items: string[] };
type QuoteBlock = { type: "quote"; text: string; author?: string };
type Block = ParagraphBlock | ListBlock | QuoteBlock;

export function BiohackingDetailPage() {
  const {id} = useParams<{id: string}>();
  const dict = useDictionary(DictionaryKey.BIOHACKING);

  if (!dict) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const article = dict.items.find(i => i.id === id);

  if (!article) {
    return (
      <section className={styles.wrap}>
        <div className={styles.empty}>
          <p>
            {dict.notFound}
          </p>
          <Link
            to={PATHS.BIOHACKING.LIST}
            className={styles.btn}
          >
            {dict.backToAll}
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
      {article.img && (
        <figure className={styles.figure}>
          <img
            src={article.img}
            alt={article.title}
            className={styles.cover}
          />
        </figure>
      )}

      <header className={styles.head}>
        <p className={styles.eyebrow}>
          {dict.articleEyebrow}
        </p>
        <h1
          id="article-title"
          className={styles.title}
        >
          {article.title}
        </h1>
        {article.subtitle && <p className={styles.subtitle}>
          {article.subtitle}
        </p>}
        <div className={styles.metaRow}>
          <Link
            to={PATHS.BIOHACKING.LIST}
            className={styles.back}
          >
            {dict.back}
          </Link>
        </div>
      </header>

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
                aria-label={block.title || dict.listDefaultLabel}
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
                {block.author && <figcaption className={styles.caption}>
                  —
                  {block.author}
                </figcaption>}
              </figure>
            );
          }

          return null;
        })}
      </div>
    </article>
  );
}
