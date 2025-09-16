import {useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import logoBrain from "src/assets/BRAIN100.webp";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const LEFT_LINKS = [
  {label: "О проекте", to: PATHS.ABOUT},
  {label: "Состояния и эмоции", to: PATHS.MENTAL_HEALTH.LIST},
  {label: "Диагностика", to: PATHS.DIAGNOSTICS.LIST},
  {label: "Здоровье и энергия", to: PATHS.BIOHACKING.LIST},
] as const;

const RIGHT_LINKS = [
  {label: "Специалисты", to: PATHS.SPECIALISTS.LIST},
  {label: "Контакты", to: PATHS.CONTACTS},
] as const;

const CTA_TEXT = "Поддержка";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={styles.header}
      role="banner"
    >
      <nav
        className={styles.nav}
        aria-label="Primary navigation"
      >
        <Link
          to={PATHS.HOME}
          className={styles.logo}
          aria-label="Home"
        >
          <img
            src={logoBrain}
            alt="BRAIN"
            className={styles.logoImg}
          />
        </Link>

        <ul
          className={styles.centerList}
          aria-label="Site sections"
        >
          {LEFT_LINKS.map((item) => (
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

        <ul
          className={styles.rightList}
          aria-label="Quick links"
        >
          {RIGHT_LINKS.map((item) => (
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

          <li className={styles.burgerWrap}>
            <button
              type="button"
              className={`${styles.burger} ${open ? styles.burgerOpen : ""}`}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </li>
        </ul>
      </nav>

      <button
        aria-hidden={!open}
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-drawer"
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <img
            src={logoBrain}
            alt="BRAIN"
            className={styles.drawerLogo}
          />
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            ×
          </button>
        </div>

        <ul className={styles.drawerList}>
          {LEFT_LINKS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={styles.drawerLink}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.drawerFoot}>
          <NavLink
            to={PATHS.SUPPORT.LIST}
            className={styles.cta}
            onClick={() => setOpen(false)}
          >
            {CTA_TEXT}
          </NavLink>
        </div>
      </aside>
    </header>
  );
}
