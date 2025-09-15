import {Facebook, Instagram, Linkedin, Twitter} from "lucide-react";
import {ANCHORS, PATHS} from "src/routes/routes";
import styles from "src/components/Footer/Footer.module.scss";

const COPYRIGHT = "© 2025 Ментальное здоровье";
const SOCIALS = [
  {href: "https://twitter.com", Icon: Twitter, label: "Twitter"},
  {href: "https://facebook.com", Icon: Facebook, label: "Facebook"},
  {href: "https://instagram.com", Icon: Instagram, label: "Instagram"},
  {href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn"},
] as const;

const COL_1 = {
  title: "Разделы",
  links: [
    {label: "Состояния", href: PATHS.MENTAL_HEALTH.ROOT},
    {label: "Диагностика", href: PATHS.DIAGNOSTICS.ROOT},
    {label: "Биохакинг", href: PATHS.BIOHACKING.ROOT},
    {label: "SOS / Первая помощь", href: `/${ANCHORS.DIAGNOSTICS}`},
  ],
} as const;

const COL_2 = {
  title: "О проекте",
  links: [
    {label: "Описание", href: PATHS.ABOUT},
    {label: "О специалисте", href: PATHS.SPECIALIST},
    {label: "Контакты", href: PATHS.CONTACTS},
    {label: "Задать вопрос", href: `/${ANCHORS.CONTACTS}`},
  ],
} as const;

const COL_3 = {
  title: "Ресурсы",
  links: [
    {label: "Статьи о состояниях", href: PATHS.MENTAL_HEALTH.ROOT},
    {label: "Тесты", href: PATHS.DIAGNOSTICS.ROOT},
    {label: "Статьи по биохакингу", href: PATHS.BIOHACKING.ROOT},
    {label: "Консилиум", href: PATHS.CONTACTS},
  ],
} as const;

const COL_4 = {
  title: "Правовое",
  links: [
    {label: "Политика конфиденциальности", href: "/privacy-policy"},
    {label: "Условия пользования", href: "/terms-of-use"},
    {label: "Карта сайта", href: "/sitemap"},
  ],
} as const;

export function Footer() {
  return (
    <footer
      className={styles.footer}
      aria-label="Подвал сайта"
    >
      <div className={styles.grid}>
        <nav
          className={styles.col}
          aria-label={COL_1.title}
        >
          <h3 className={styles.colTitle}>
            {COL_1.title}
          </h3>
          <ul className={styles.list}>
            {COL_1.links.map(l => (
              <li
                key={l.label}
                className={styles.item}
              >
                <a
                  href={l.href}
                  className={styles.link}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className={styles.col}
          aria-label={COL_2.title}
        >
          <h3 className={styles.colTitle}>
            {COL_2.title}
          </h3>
          <ul className={styles.list}>
            {COL_2.links.map(l => (
              <li
                key={l.label}
                className={styles.item}
              >
                <a
                  href={l.href}
                  className={styles.link}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className={styles.col}
          aria-label={COL_3.title}
        >
          <h3 className={styles.colTitle}>
            {COL_3.title}
          </h3>
          <ul className={styles.list}>
            {COL_3.links.map(l => (
              <li
                key={l.label}
                className={styles.item}
              >
                <a
                  href={l.href}
                  className={styles.link}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          className={styles.col}
          aria-label={COL_4.title}
        >
          <h3 className={styles.colTitle}>
            {COL_4.title}
          </h3>
          <ul className={styles.list}>
            {COL_4.links.map(l => (
              <li
                key={l.label}
                className={styles.item}
              >
                <a
                  href={l.href}
                  className={styles.link}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <ul
          className={styles.socials}
          aria-label="Социальные сети"
        >
          {SOCIALS.map(s => (
            <li
              key={s.label}
              className={styles.socialItem}
            >
              <a
                href={s.href}
                aria-label={s.label}
                className={styles.socialLink}
              >
                <s.Icon className={styles.socialIcon} />
              </a>
            </li>
          ))}
        </ul>

        <p className={styles.copy}>
          {COPYRIGHT}
        </p>
      </div>
    </footer>
  );
}
