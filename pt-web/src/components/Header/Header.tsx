import {Link, NavLink} from "react-router-dom";
import logo from "src/assets/logo.png";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const CTA_TEXT = "Поддержка";

const NAV_CENTER = [
  {label: "О проекте", to: PATHS.ABOUT},
  {label: "Состояния и эмоции", to: PATHS.MENTAL_HEALTH.LIST},
  {label: "Диагностика", to: PATHS.DIAGNOSTICS.LIST},
  {label: "Здоровье и энергия", to: PATHS.BIOHACKING.LIST},
] as const;

const NAV_RIGHT = [
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
        <Link
          to={PATHS.HOME}
          className={styles.logo}
          aria-label="На главную"
        >
          <img
            src={logo}
            alt="BRAIN100"
            className={styles.logoImg}
          />
        </Link>

        <div className={styles.middle}>
          <ul className={styles.navList}>
            {NAV_CENTER.map((item) => (
              <li
                key={item.to}
                className={styles.navItem}
              >
                <NavLink
                  to={item.to}
                  className={({isActive}) =>
                    `${styles.navLink} ${isActive ? styles.active : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <ul
          className={styles.navList}
          aria-label="Вторичная навигация"
        >
          {NAV_RIGHT.map((item) => (
            <li
              key={item.to}
              className={styles.navItem}
            >
              <NavLink
                to={item.to}
                className={({isActive}) =>
                  `${styles.navLink} ${isActive ? styles.active : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}

          <li className={styles.navItem}>
            <NavLink
              to={PATHS.SUPPORT.LIST}
              className={styles.cta}
            >
              {CTA_TEXT}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
