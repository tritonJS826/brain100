import {Link} from "react-router-dom";
import logo from "src/assets/brightside-health-logo.svg";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const CTA_TEXT = "Пройти тест";
const NAV_LINKS_LEFT = [
  {label: "О проекте", to: PATHS.ABOUT},
  {label: "Состояния и эмоции", to: PATHS.MENTAL_HEALTH.LIST},
  {label: "Диагностика", to: PATHS.DIAGNOSTICS.LIST},
  {label: "Здоровье и энергия", to: PATHS.BIOHACKING.LIST},
] as const;

const NAV_LINKS_RIGHT = [
  {label: "Специалисты", to: PATHS.SPECIALISTS.LIST},
  {label: "Контакты", to: PATHS.CONTACTS},
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
        <ul className={styles.navList}>
          {NAV_LINKS_LEFT.map(item => (
            <li
              key={item.to}
              className={styles.navItem}
            >
              <Link
                to={item.to}
                className={styles.navLink}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to={PATHS.HOME}
          className={styles.logo}
          aria-label="На главную"
        >
          <img
            src={logo}
            alt="logo"
            className={styles.logoImg}
          />
        </Link>

        <ul className={styles.navList}>
          {NAV_LINKS_RIGHT.map(item => (
            <li
              key={item.to}
              className={styles.navItem}
            >
              <Link
                to={item.to}
                className={styles.navLink}
              >
                {item.label}
              </Link>
            </li>
          ))}

          <li className={styles.navItem}>
            <Link
              to={PATHS.SUPPORT.LIST}
              className={styles.cta}
            >
              {CTA_TEXT}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
