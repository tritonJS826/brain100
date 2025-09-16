import React, {useEffect, useMemo, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import logo from "src/assets/BRAIN100.webp";
import {
  BIOHACKING_ARTICLES,
  CTA_TEXT,
  DIAGNOSTIC_TESTS,
  LEFT_LINKS,
  MENTAL_ITEMS,
  MenuKey,
  RIGHT_LINKS,
  TIMEOUT_MENU_MS,
} from "src/components/Header/header.config";
import {buildPath, PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<MenuKey | null>(null);
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

  const onEnterNav = (key: MenuKey) => {
    cancelClose();
    setActiveKey(key);
    setDockOpen(true);
    scheduleClose();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        closeDock();
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

  const dockContent = useMemo(() => {
    return {
      about: (
        <div className={styles.dockCols}>
          <div className={styles.dockCol}>
            <NavLink
              to={PATHS.ABOUT}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              О проекте
            </NavLink>
            <NavLink
              to={PATHS.SUPPORT.LIST}
              className={styles.dockCta}
              onClick={closeDock}
            >
              {CTA_TEXT}
            </NavLink>
          </div>
        </div>
      ),
      mental: (
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
              {MENTAL_ITEMS.map((i) => (
                <li key={i.slug}>
                  <NavLink
                    to={buildPath.mentalHealthDetail(i.slug)}
                    className={styles.dockLink}
                    onClick={closeDock}
                  >
                    {i.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      diagnostics: (
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
              {DIAGNOSTIC_TESTS.map((t) => (
                <li key={t.slug}>
                  <NavLink
                    to={buildPath.diagnosticsDetail(t.slug)}
                    className={styles.dockLink}
                    onClick={closeDock}
                  >
                    {t.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      biohacking: (
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
              {BIOHACKING_ARTICLES.map((a) => (
                <li key={a.slug}>
                  <NavLink
                    to={buildPath.biohackingDetail(a.slug)}
                    className={styles.dockLink}
                    onClick={closeDock}
                  >
                    {a.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      specialists: (
        <div className={styles.dockCols}>
          <div className={styles.dockCol}>
            <NavLink
              to={PATHS.SPECIALISTS.LIST}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              Список специалистов
            </NavLink>
            <NavLink
              to={PATHS.SUPPORT.LIST}
              className={styles.dockCta}
              onClick={closeDock}
            >
              {CTA_TEXT}
            </NavLink>
          </div>
        </div>
      ),
      contacts: (
        <div className={styles.dockCols}>
          <div className={styles.dockCol}>
            <NavLink
              to={PATHS.CONTACTS}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              Контакты
            </NavLink>
            <NavLink
              to={PATHS.SUPPORT.LIST}
              className={styles.dockCta}
              onClick={closeDock}
            >
              {CTA_TEXT}
            </NavLink>
          </div>
        </div>
      ),
    } as Record<MenuKey, React.ReactNode>;
  }, []);

  const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

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
            {ALL_LINKS.map((item) => (
              <li
                key={item.key}
                className={styles.navItem}
                onMouseEnter={() => onEnterNav(item.key)}
                aria-haspopup="true"
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
                          : item.key === "biohacking"
                            ? PATHS.BIOHACKING.LIST
                            : item.key === "specialists"
                              ? PATHS.SPECIALISTS.LIST
                              : PATHS.CONTACTS
                  }
                  className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <NavLink
          to={PATHS.SUPPORT.LIST}
          className={styles.cta}
        >
          {CTA_TEXT}
        </NavLink>

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
      </nav>

      <aside
        className={`${styles.dock} ${dockOpen && activeKey ? styles.dockOpen : ""}`}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        aria-hidden={!dockOpen}
      >
        <div className={styles.dockInner}>
          {activeKey ? dockContent[activeKey] : null}
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
          <img
            src={logo}
            alt="BRAIN100"
            className={styles.drawerLogo}
          />
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>

        <ul className={styles.drawerList}>
          {ALL_LINKS.map((item) => (
            <li key={item.key}>
              <NavLink
                to={
                  item.key === "about"
                    ? PATHS.ABOUT
                    : item.key === "mental"
                      ? PATHS.MENTAL_HEALTH.LIST
                      : item.key === "diagnostics"
                        ? PATHS.DIAGNOSTICS.LIST
                        : item.key === "biohacking"
                          ? PATHS.BIOHACKING.LIST
                          : item.key === "specialists"
                            ? PATHS.SPECIALISTS.LIST
                            : PATHS.CONTACTS
                }
                className={styles.drawerLink}
                onClick={() => setDrawerOpen(false)}
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
            onClick={() => setDrawerOpen(false)}
          >
            {CTA_TEXT}
          </NavLink>
        </div>
      </aside>
    </header>
  );
}
