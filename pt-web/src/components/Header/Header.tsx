import logo from "public/brightside-health-logo.svg";
import styles from "src/components/Header/Header.module.scss";

const CTA_TEXT = "Пройти тест";
const NAV_LINKS_LEFT = [
  {label: "О проекте", href: "#about"},
  {label: "Состояния и эмоции", href: "#mental-health"},
  {label: "Диагностика", href: "#diagnostics"},
  {label: "Здоровье и энергия", href: "#biohacking"},
] as const;

const NAV_LINKS_RIGHT = [
  {label: "Специалисты", href: "#about-me"},
  {label: "Контакты", href: "#contacts"},
] as const;

export function Header() {
  return (
    <header
      className={styles.header}
      role="banner"
    >
      <nav
        className={styles.nav}
        aria-label="Основная навигация"
      >
        <ul className={styles.nav__list}>
          {NAV_LINKS_LEFT.map(item => (
            <li
              key={item.href}
              className={styles.nav__item}
            >
              <a
                href={item.href}
                className={styles.nav__link}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#home"
          className={styles.logo}
          aria-label="На главную"
        >
          <img
            src={logo}
            alt="Логотип"
            className={styles.logo__img}
          />
        </a>

        <ul className={styles.nav__list}>
          {NAV_LINKS_RIGHT.map(item => (
            <li
              key={item.href}
              className={styles.nav__item}
            >
              <a
                href={item.href}
                className={styles.nav__link}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className={styles.nav__item}>
            <a
              href="#diagnostics"
              className={styles.cta}
            >
              {CTA_TEXT}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
