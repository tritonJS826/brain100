import {Link} from "react-router-dom";
import {Facebook, Instagram, Linkedin, Twitter} from "lucide-react";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Footer/Footer.module.scss";

const COPYRIGHT = "© 2025 BRAIN100. Бережная поддержка психического здоровья.";

const SOCIALS = [
  {href: "https://twitter.com", Icon: Twitter, label: "Twitter"},
  {href: "https://facebook.com", Icon: Facebook, label: "Facebook"},
  {href: "https://instagram.com", Icon: Instagram, label: "Instagram"},
  {href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn"},
] as const;

const COL_1 = {
  title: "Разделы",
  links: [
    {label: "Состояния и эмоции", to: PATHS.MENTAL_HEALTH.LIST},
    {label: "Диагностика", to: PATHS.DIAGNOSTICS.LIST},
    {label: "Здоровье и энергия", to: PATHS.BIOHACKING.LIST},
    {label: "Поддержка", to: PATHS.SUPPORT.LIST},
  ],
} as const;

const COL_2 = {
  title: "О проекте",
  links: [
    {label: "Описание проекта", to: PATHS.ABOUT},
    {label: "Специалисты", to: PATHS.SPECIALISTS.LIST},
    {label: "Контакты", to: PATHS.CONTACTS},
    {label: "Личный кабинет", to: PATHS.PROFILE.PAGE},
  ],
} as const;

const COL_3 = {
  title: "Ресурсы",
  links: [
    {label: "Каталог статей", to: PATHS.MENTAL_HEALTH.LIST},
    {label: "Каталог тестов", to: PATHS.DIAGNOSTICS.LIST},
    {label: "Биохакинг: статьи", to: PATHS.BIOHACKING.LIST},
    {label: "Поддержка и SOS", to: PATHS.SUPPORT.LIST},
  ],
} as const;

export function Footer() {
  return (
    <footer
      className={styles.footer}
      aria-label="Подвал сайта"
    >
      <div className={styles.grid}>
        {[COL_1, COL_2, COL_3].map((col) => (
          <nav
            key={col.title}
            className={styles.col}
            aria-label={col.title}
          >
            <h3 className={styles.colTitle}>
              {col.title}
            </h3>
            <ul className={styles.list}>
              {col.links.map((l) => (
                <li
                  key={l.label}
                  className={styles.item}
                >
                  <Link
                    to={l.to}
                    className={styles.link}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <ul
          className={styles.socials}
          aria-label="Социальные сети"
        >
          {SOCIALS.map((s) => (
            <li
              key={s.label}
              className={styles.socialItem}
            >
              <a
                href={s.href}
                aria-label={s.label}
                className={styles.socialLink}
                target="_blank"
                rel="noreferrer"
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
