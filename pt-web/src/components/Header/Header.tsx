import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {UserRound} from "lucide-react";
import logo from "src/assets/BRAIN100.webp";
import {
  BIOHACKING_ARTICLES,
  DIAGNOSTIC_TESTS,
  LEFT_LINKS,
  MENTAL_ITEMS,
  MenuKey,
  RIGHT_LINKS,
  TIMEOUT_MENU_MS,
} from "src/components/Header/header.config";
import {buildPath, PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const HALF = 2;
const DROPDOWN_KEYS: MenuKey[] = ["mental", "diagnostics", "biohacking"];

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<MenuKey | null>(null);
  const [drawerActive, setDrawerActive] = useState<MenuKey | null>(null);

  const [lang, setLang] = useState<"ru" | "en">("ru");
  const [langOpen, setLangOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const langBtnRef = useRef<HTMLButtonElement | null>(null);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const closeDock = () => {
    setDockOpen(false);
    setActiveKey(null);
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const cancelClose = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeDock();
    }, TIMEOUT_MENU_MS) as unknown as number;
  };

  const onEnterNav = (key: MenuKey, el: HTMLElement | null) => {
    if (!DROPDOWN_KEYS.includes(key)) {
      closeDock();

      return;
    }
    cancelClose();
    setActiveKey(key);
    setDockOpen(true);

    if (el && navRef.current) {
      const navBox = navRef.current.getBoundingClientRect();
      const elBox = el.getBoundingClientRect();
      const centerX = (elBox.left - navBox.left) + (elBox.width / HALF);
      navRef.current.style.setProperty("--dock-x", `${centerX}px`);
    }
    scheduleClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        closeDock();
        setLangOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!dockOpen) {
      return;
    }
    const onScroll = () => closeDock();
    const onDown = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest(`.${styles.dock}`) && !el.closest(`.${styles.nav}`)) {
        closeDock();
      }
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    document.addEventListener("mousedown", onDown);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onDown);
    };
  }, [dockOpen]);

  useEffect(() => {
    if (!langOpen) {
      return;
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        langMenuRef.current && !langMenuRef.current.contains(t) &&
        langBtnRef.current && !langBtnRef.current.contains(t)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, [langOpen]);

  const toggleDrawerSection = (key: MenuKey) => {
    setDrawerActive(prev => (prev === key ? null : key));
  };

  const renderDockContent = (key: MenuKey | null) => {
    if (!key || !DROPDOWN_KEYS.includes(key)) {
      return null;
    }

    if (key === "mental") {
      return (
        <div className={styles.dockCols}>
          <div className={styles.dockCol}>
            <NavLink
              to={PATHS.MENTAL_HEALTH.LIST}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              Все состояния
            </NavLink>
            <ul className={styles.dockList}>
              <li>
                <ul className={styles.dockListRow}>
                  {MENTAL_ITEMS.map(i => (
                    <li key={i.id}>
                      <NavLink
                        to={buildPath.mentalHealthDetail(i.id)}
                        className={styles.dockLink}
                        onClick={closeDock}
                      >
                        {i.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <NavLink
              to={PATHS.DIAGNOSTICS.LIST}
              className={styles.dockCta}
              onClick={closeDock}
            >
              Пройти тест
            </NavLink>
          </div>
        </div>
      );
    }

    if (key === "diagnostics") {
      return (
        <div className={styles.dockCols}>
          <div className={styles.dockCol}>
            <NavLink
              to={PATHS.DIAGNOSTICS.LIST}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              Все тесты
            </NavLink>
            <ul className={styles.dockList}>
              <li>
                <ul className={styles.dockListRow}>
                  {DIAGNOSTIC_TESTS.map(test => (
                    <li key={test.id}>
                      <NavLink
                        to={buildPath.diagnosticsDetail(test.id)}
                        className={styles.dockLink}
                        onClick={closeDock}
                      >
                        {test.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
            <NavLink
              to={PATHS.DIAGNOSTICS.LIST}
              className={styles.dockCta}
              onClick={closeDock}
            >
              Пройти тест
            </NavLink>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.dockCols}>
        <div className={styles.dockCol}>
          <NavLink
            to={PATHS.BIOHACKING.LIST}
            className={styles.dockHeading}
            onClick={closeDock}
          >
            Все статьи
          </NavLink>
          <ul className={styles.dockList}>
            <li>
              <ul className={styles.dockListRow}>
                {BIOHACKING_ARTICLES.map(a => (
                  <li key={a.id}>
                    <NavLink
                      to={buildPath.biohackingDetail(a.id)}
                      className={styles.dockLink}
                      onClick={closeDock}
                    >
                      {a.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <NavLink
            to={PATHS.DIAGNOSTICS.LIST}
            className={styles.dockCta}
            onClick={closeDock}
          >
            Пройти тест
          </NavLink>
        </div>
      </div>
    );
  };

  const ORDER: MenuKey[] = ["about", "mental", "diagnostics", "biohacking"];
  const MAP = [...LEFT_LINKS, ...RIGHT_LINKS].reduce<Record<string, { key: MenuKey; label: string }>>(
    (acc, item) => ({...acc, [item.key]: item}),
    {},
  );
  const ALL_LINKS = ORDER.map(k => MAP[k]).filter((v): v is { key: MenuKey; label: string } => Boolean(v));

  return (
    <header
      className={styles.header}
      role="banner"
    >
      <nav
        ref={navRef}
        className={styles.nav}
        aria-label="Primary navigation"
      >
        <Link
          to={PATHS.HOME}
          className={styles.logo}
          aria-label="Home"
        >
          <img
            src={logo}
            alt="BRAIN100"
            className={styles.logoImg}
          />
        </Link>

        <div className={styles.navCenter}>
          <ul
            className={styles.navAll}
            aria-label="Main sections"
            onMouseLeave={scheduleClose}
          >
            {ALL_LINKS.map(item => (
              <li
                key={item.key}
                className={styles.navItem}
                onMouseEnter={(e) => onEnterNav(item.key, e.currentTarget as HTMLElement)}
                aria-haspopup={DROPDOWN_KEYS.includes(item.key)}
                aria-expanded={dockOpen && activeKey === item.key}
              >
                <NavLink
                  to={
                    item.key === "about"
                      ? PATHS.ABOUT
                      : item.key === "mental"
                        ? PATHS.MENTAL_HEALTH.LIST
                        : item.key === "diagnostics"
                          ? PATHS.DIAGNOSTICS.LIST
                          : PATHS.BIOHACKING.LIST
                  }
                  className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <NavLink
            to={PATHS.PROFILE.PAGE}
            className={styles.iconBtn}
            aria-label="Личный кабинет"
          >
            <UserRound className={styles.icon} />
          </NavLink>

          <div className={styles.langWrap}>
            <button
              ref={langBtnRef}
              type="button"
              className={styles.langBtn}
              onClick={() => setLangOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-controls="lang-menu"
            >
              {lang.toUpperCase()}
            </button>
            <div
              id="lang-menu"
              ref={langMenuRef}
              className={`${styles.langMenu} ${langOpen ? styles.langMenuOpen : ""}`}
              role="menu"
            >
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "ru"}
                onClick={() => {
                  setLang("ru"); setLangOpen(false);
                }}
              >
                RU
              </button>
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "en"}
                onClick={() => {
                  setLang("en"); setLangOpen(false);
                }}
              >
                EN
              </button>
            </div>
          </div>

          <li className={styles.burgerWrap}>
            <button
              type="button"
              className={`${styles.burger} ${drawerOpen ? styles.burgerOpen : ""}`}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              onClick={() => setDrawerOpen(v => !v)}
            >
              <span className={styles.burgerInner}>
                <span />
                <span />
                <span />
              </span>
            </button>
          </li>

          <NavLink
            to={PATHS.SOS.LIST}
            className={styles.cta}
          >
            SOS
          </NavLink>
        </div>
      </nav>

      <aside
        className={`${styles.dock} ${dockOpen && activeKey ? styles.dockOpen : ""}`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        aria-hidden={!dockOpen}
      >
        <div className={styles.dockInner}>
          {renderDockContent(activeKey)}
        </div>
      </aside>

      <button
        aria-hidden={!drawerOpen}
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropOpen : ""}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside
        id="mobile-drawer"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <Link
            to={PATHS.HOME}
            className={styles.logo}
            aria-label="Home"
            onClick={() => setDrawerOpen(false)}
          >
            <img
              src={logo}
              alt="BRAIN100"
              className={styles.drawerLogo}
            />
          </Link>
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>

        <div className={styles.drawerScroll}>
          <ul className={styles.drawerList}>
            {ALL_LINKS.map(item => (
              <li key={item.key}>
                {DROPDOWN_KEYS.includes(item.key)
                  ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.drawerLink} ${styles.drawerLinkBtn} ${drawerActive === item.key
                          ? styles.drawerLinkOpen
                          : ""}`}
                        onClick={() => toggleDrawerSection(item.key)}
                        aria-expanded={drawerActive === item.key}
                      >
                        {item.label}
                        <span
                          className={`${styles.chevron} ${drawerActive === item.key ? styles.chevronDown : styles.chevronRight}`}
                          aria-hidden
                        />
                      </button>

                      <ul
                        className={`${styles.submenu} ${drawerActive === item.key ? styles.submenuOpen : ""}`}
                        style={{maxHeight: drawerActive === item.key ? "520px" : "0px"}}
                      >
                        {item.key === "mental" && MENTAL_ITEMS.map(i => (
                          <li key={i.id}>
                            <NavLink
                              to={buildPath.mentalHealthDetail(i.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {i.label}
                            </NavLink>
                          </li>
                        ))}

                        {item.key === "diagnostics" && DIAGNOSTIC_TESTS.map(t => (
                          <li key={t.id}>
                            <NavLink
                              to={buildPath.diagnosticsDetail(t.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {t.label}
                            </NavLink>
                          </li>
                        ))}

                        {item.key === "biohacking" && BIOHACKING_ARTICLES.map(a => (
                          <li key={a.id}>
                            <NavLink
                              to={buildPath.biohackingDetail(a.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {a.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                  : (
                    <NavLink
                      to={item.key === "about" ? PATHS.ABOUT : PATHS.HOME}
                      className={styles.drawerLink}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.drawerFoot}>
          <div className={styles.langWrap}>
            <button
              type="button"
              className={styles.langBtn}
              onClick={() => setLangOpen(v => !v)}
              aria-haspopup="true"
              aria-expanded={langOpen}
              aria-controls="lang-menu-drawer"
            >
              {lang.toUpperCase()}
            </button>
            <div
              id="lang-menu-drawer"
              className={`${styles.langMenu} ${styles.langMenuSide} ${langOpen ? styles.langMenuOpen : ""}`}
              role="menu"
            >
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "ru"}
                onClick={() => {
                  setLang("ru"); setLangOpen(false);
                }}
              >
                RU
              </button>
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "en"}
                onClick={() => {
                  setLang("en"); setLangOpen(false);
                }}
              >
                EN
              </button>
            </div>
          </div>

          <NavLink
            to={PATHS.PROFILE.PAGE}
            className={styles.langBtn}
            onClick={() => setDrawerOpen(false)}
          >
            <UserRound className={styles.icon} />
          </NavLink>

          <NavLink
            to={PATHS.SOS.LIST}
            className={styles.cta}
            onClick={() => setDrawerOpen(false)}
          >
            SOS
          </NavLink>
        </div>
      </aside>
    </header>
  );
}
