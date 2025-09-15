import logo from "src/assets/brightside-health-logo.svg";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const CTA_TEXT = "Поддержка";

const NAV_LINKS_LEFT = [
  {label: "О проекте", href: PATHS.ABOUT},
  {label: "Состояния и эмоции", href: PATHS.MENTAL_HEALTH.ROOT},
  {label: "Диагностика", href: PATHS.DIAGNOSTICS.ROOT},
  {label: "Здоровье и энергия", href: PATHS.BIOHACKING.ROOT},
] as const;

const NAV_LINKS_RIGHT = [
  {label: "Специалисты", href: PATHS.SPECIALISTS.ROOT},
  {label: "Контакты", href: PATHS.CONTACTS},
] as const;

export function Header() {
  return (
    <header
      className={styles.header}
      role="banner"
    >
      <nav
        className={styles.nav}
        aria-label="Navigation"
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
          href={PATHS.HOME}
          className={styles.logo}
          aria-label="Home"
        >
          <img
            src={logo}
            alt="logo"
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
              href={PATHS.SUPPORT.ROOT}
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
