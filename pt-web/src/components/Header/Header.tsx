import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {useAtom} from "jotai";
import {UserRound} from "lucide-react";
import logo from "src/assets/BRAIN100.webp";
import {
  LEFT_LINK_KEYS,
  MenuKey,
  TIMEOUT_MENU_MS,
} from "src/components/Header/header.config";
import {languageAtomWithPersistence} from "src/dictionary/dictionaryAtom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath, PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const HALF = 2;
const DROPDOWN_KEYS: MenuKey[] = ["mental", "diagnostics", "biohacking"];

export function Header() {
  const dictionary = useDictionary(DictionaryKey.COMMON);
  const [lang, setLang] = useAtom(languageAtomWithPersistence);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<MenuKey | null>(null);
  const [drawerActive, setDrawerActive] = useState<MenuKey | null>(null);
  const [langOpenTop, setLangOpenTop] = useState(false);
  const [langOpenDrawer, setLangOpenDrawer] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const langBtnTopRef = useRef<HTMLButtonElement | null>(null);
  const langMenuTopRef = useRef<HTMLDivElement | null>(null);
  const langBtnDrawerRef = useRef<HTMLButtonElement | null>(null);
  const langMenuDrawerRef = useRef<HTMLDivElement | null>(null);
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
        setLangOpenTop(false);
        setLangOpenDrawer(false);
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
    if (!langOpenTop) {
      return;
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        langMenuTopRef.current && !langMenuTopRef.current.contains(t) &&
        langBtnTopRef.current && !langBtnTopRef.current.contains(t)
      ) {
        setLangOpenTop(false);
      }
    };
    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, [langOpenTop]);

  useEffect(() => {
    if (!langOpenDrawer) {
      return;
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        langMenuDrawerRef.current && !langMenuDrawerRef.current.contains(t) &&
        langBtnDrawerRef.current && !langBtnDrawerRef.current.contains(t)
      ) {
        setLangOpenDrawer(false);
      }
    };
    document.addEventListener("mousedown", onDown);

    return () => document.removeEventListener("mousedown", onDown);
  }, [langOpenDrawer]);

  const toggleDrawerSection = (key: MenuKey) => {
    setDrawerActive(prev => (prev === key ? null : key));
  };

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const labelByKey = (key: MenuKey) => {
    switch (key) {
      case "about": return dictionary.nav.about;
      case "mental": return dictionary.nav.mental;
      case "diagnostics": return dictionary.nav.diagnostics;
      case "biohacking": return dictionary.nav.biohacking;
      default: return "";
    }
  };

  const mentalItems = Object.entries(dictionary.nav.menus.mental).map(
    ([id, label]) => ({id, label}),
  );
  const diagnosticItems = Object.entries(dictionary.nav.menus.diagnostics).map(
    ([id, label]) => ({id, label}),
  );
  const biohackingItems = Object.entries(dictionary.nav.menus.biohacking).map(
    ([id, label]) => ({id, label}),
  );

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
              {dictionary.dock.allStates}
            </NavLink>
            <ul className={styles.dockList}>
              <li>
                <ul className={styles.dockListRow}>
                  {mentalItems.map(i => (
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
              {dictionary.dock.takeTest}
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
              {dictionary.dock.allTests}
            </NavLink>
            <ul className={styles.dockList}>
              <li>
                <ul className={styles.dockListRow}>
                  {diagnosticItems.map(test => (
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
              {dictionary.dock.takeTest}
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
            {dictionary.dock.allArticles}
          </NavLink>
          <ul className={styles.dockList}>
            <li>
              <ul className={styles.dockListRow}>
                {biohackingItems.map(a => (
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
            {dictionary.dock.takeTest}
          </NavLink>
        </div>
      </div>
    );
  };

  return (
    <header
      className={styles.header}
      role="banner"
    >
      <nav
        ref={navRef}
        className={styles.nav}
        aria-label={dictionary.nav.ariaPrimary}
      >
        <Link
          to={PATHS.HOME}
          className={styles.logo}
          aria-label={dictionary.nav.ariaHome}
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
            {LEFT_LINK_KEYS.map(key => (
              <li
                key={key}
                className={styles.navItem}
                onMouseEnter={(e) => onEnterNav(key, e.currentTarget as HTMLElement)}
                aria-haspopup={DROPDOWN_KEYS.includes(key)}
                aria-expanded={dockOpen && activeKey === key}
              >
                <NavLink
                  to={
                    key === "about"
                      ? PATHS.ABOUT
                      : key === "mental"
                        ? PATHS.MENTAL_HEALTH.LIST
                        : key === "diagnostics"
                          ? PATHS.DIAGNOSTICS.LIST
                          : PATHS.BIOHACKING.LIST
                  }
                  className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  {labelByKey(key)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <NavLink
            to={PATHS.PROFILE.PAGE}
            className={styles.iconBtn}
            aria-label={dictionary.nav.profile}
          >
            <UserRound className={styles.icon} />
          </NavLink>

          <div className={styles.langWrap}>
            <button
              ref={langBtnTopRef}
              type="button"
              className={styles.langBtn}
              onClick={() => setLangOpenTop(v => !v)}
              aria-haspopup="true"
              aria-expanded={langOpenTop}
              aria-controls="lang-menu-top"
            >
              {(lang === "ru" ? dictionary.lang.ru : dictionary.lang.en)}
            </button>
            <div
              id="lang-menu-top"
              ref={langMenuTopRef}
              className={`${styles.langMenu} ${langOpenTop ? styles.langMenuOpen : ""}`}
              role="menu"
            >
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "ru"}
                onClick={() => {
                  setLang("ru"); setLangOpenTop(false);
                }}
              >
                {dictionary.lang.ru}
              </button>
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "en"}
                onClick={() => {
                  setLang("en"); setLangOpenTop(false);
                }}
              >
                {dictionary.lang.en}
              </button>
            </div>
          </div>

          <li className={styles.burgerWrap}>
            <button
              type="button"
              className={`${styles.burger} ${drawerOpen ? styles.burgerOpen : ""}`}
              aria-label={dictionary.nav.ariaOpenMenu}
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
            {dictionary.nav.sos}
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
        aria-label={dictionary.nav.ariaMenu}
      >
        <div className={styles.drawerHead}>
          <Link
            to={PATHS.HOME}
            className={styles.logo}
            aria-label={dictionary.nav.ariaHome}
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
            aria-label={dictionary.nav.ariaCloseMenu}
            onClick={() => setDrawerOpen(false)}
          >
            ×
          </button>
        </div>

        <div className={styles.drawerScroll}>
          <ul className={styles.drawerList}>
            {LEFT_LINK_KEYS.map(key => (
              <li key={key}>
                {DROPDOWN_KEYS.includes(key)
                  ? (
                    <>
                      <button
                        type="button"
                        className={`${styles.drawerLink} ${styles.drawerLinkBtn} ${drawerActive === key
                          ? styles.drawerLinkOpen
                          : ""}`}
                        onClick={() => toggleDrawerSection(key)}
                        aria-expanded={drawerActive === key}
                      >
                        {labelByKey(key)}
                        <span
                          className={`${styles.chevron} ${drawerActive === key ? styles.chevronDown : styles.chevronRight}`}
                          aria-hidden
                        />
                      </button>

                      <ul
                        className={`${styles.submenu} ${drawerActive === key ? styles.submenuOpen : ""}`}
                        style={{maxHeight: drawerActive === key ? "520px" : "0px"}}
                      >
                        {key === "mental" && mentalItems.map(i => (
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

                        {key === "diagnostics" && diagnosticItems.map(t => (
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

                        {key === "biohacking" && biohackingItems.map(a => (
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
                      to={key === "about" ? PATHS.ABOUT : PATHS.HOME}
                      className={styles.drawerLink}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {labelByKey(key)}
                    </NavLink>
                  )}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.drawerFoot}>
          <div className={styles.langWrap}>
            <button
              ref={langBtnDrawerRef}
              type="button"
              className={styles.langBtn}
              onClick={() => setLangOpenDrawer(v => !v)}
              aria-haspopup="true"
              aria-expanded={langOpenDrawer}
              aria-controls="lang-menu-drawer"
            >
              {(lang === "ru" ? dictionary.lang.ru : dictionary.lang.en)}
            </button>
            <div
              id="lang-menu-drawer"
              ref={langMenuDrawerRef}
              className={`${styles.langMenu} ${styles.langMenuSide} ${langOpenDrawer ? styles.langMenuOpen : ""}`}
              role="menu"
            >
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "ru"}
                onClick={() => {
                  setLang("ru"); setLangOpenDrawer(false);
                }}
              >
                {dictionary.lang.ru}
              </button>
              <button
                type="button"
                className={styles.langOption}
                role="menuitem"
                aria-current={lang === "en"}
                onClick={() => {
                  setLang("en"); setLangOpenDrawer(false);
                }}
              >
                {dictionary.lang.en}
              </button>
            </div>
          </div>

          <NavLink
            to={PATHS.PROFILE.PAGE}
            className={styles.langBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label={dictionary.nav.profile}
          >
            <UserRound className={styles.icon} />
          </NavLink>

          <NavLink
            to={PATHS.SOS.LIST}
            className={styles.cta}
            onClick={() => setDrawerOpen(false)}
          >
            {dictionary.nav.sos}
          </NavLink>
        </div>
      </aside>
    </header>
  );
}
