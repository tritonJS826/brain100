import React, {useEffect, useRef, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {useAtom} from "jotai";
import {UserRound} from "lucide-react";
import promoMental from "src/assets/1_consult.avif";
import promoTests from "src/assets/2_register.avif";
import promoBio from "src/assets/3_follow.avif";
import logo from "src/assets/BRAIN100.webp";
import {LEFT_LINK_KEYS, MenuKey, TIMEOUT_MENU_MS} from "src/components/Header/header.config";
import {useAuth} from "src/contexts/AuthContext";
import {languageAtomWithPersistence} from "src/dictionary/dictionaryAtom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath, PATHS} from "src/routes/routes";
import styles from "src/components/Header/Header.module.scss";

const HALF = 2;
const DROPDOWN_KEYS: MenuKey[] = ["mental", "tests", "biohacking"];

export function Header() {
  const dictionary = useDictionary(DictionaryKey.HEADER);
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

  const {user} = useAuth();
  const isAuthenticated = Boolean(user);
  const profileTo = isAuthenticated ? PATHS.PROFILE.PAGE : PATHS.AUTH.PAGE;

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
      case "tests": return dictionary.nav.tests;
      case "biohacking": return dictionary.nav.biohacking;
      default: return "";
    }
  };

  const mentalMenuItems = Object.entries(dictionary.nav.menus.mental).map(
    ([entryId, entryLabel]) => ({id: entryId, label: entryLabel}),
  );
  const testMenuItems = Object.entries(dictionary.nav.menus.tests).map(
    ([entryId, entryLabel]) => ({id: entryId, label: entryLabel}),
  );
  const biohackingMenuItems = Object.entries(dictionary.nav.menus.biohacking).map(
    ([entryId, entryLabel]) => ({id: entryId, label: entryLabel}),
  );

  const Promo = ({to, img, title}: { to: string; img: string; title: string }) => (
    <Link
      to={to}
      className={styles.dockPromo}
      onClick={closeDock}
    >
      <img
        src={img}
        alt={title}
        className={styles.dockPromoImg}
      />
      <span className={styles.dockPromoTitle}>
        {title}
      </span>
    </Link>
  );

  const renderDockContent = (key: MenuKey | null) => {
    if (!key || !DROPDOWN_KEYS.includes(key)) {
      return null;
    }

    if (key === "mental") {
      return (
        <div className={styles.dockLayout}>
          <div className={styles.dockLists}>
            <NavLink
              to={PATHS.MENTAL_HEALTH.LIST}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              {dictionary.dock.allStates}
            </NavLink>
            <ul className={`${styles.dockList} ${styles.dockListTwoCols}`}>
              {mentalMenuItems.map(mentalItem => (
                <li key={mentalItem.id}>
                  <NavLink
                    to={buildPath.mentalHealthDetail(mentalItem.id)}
                    className={styles.dockLink}
                    onClick={closeDock}
                  >
                    {mentalItem.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Promo
            to={buildPath.supportConsultation()}
            img={promoMental}
            title={dictionary.promo.consultCta}
          />
        </div>
      );
    }

    if (key === "tests") {
      return (
        <div className={styles.dockLayout}>
          <div className={styles.dockLists}>
            <NavLink
              to={PATHS.TESTS.LIST}
              className={styles.dockHeading}
              onClick={closeDock}
            >
              {dictionary.dock.allTests}
            </NavLink>
            <ul className={`${styles.dockList} ${styles.dockListTwoCols}`}>
              {testMenuItems.map(testItem => (
                <li key={testItem.id}>
                  <NavLink
                    to={buildPath.testsDetail(testItem.id)}
                    className={styles.dockLink}
                    onClick={closeDock}
                  >
                    {testItem.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <Promo
            to={isAuthenticated ? PATHS.PROFILE.PAGE : buildPath.auth()}
            img={promoTests}
            title={dictionary.promo.registerCta}
          />
        </div>
      );
    }

    return (
      <div className={styles.dockLayout}>
        <div className={styles.dockLists}>
          <NavLink
            to={PATHS.BIOHACKING.LIST}
            className={styles.dockHeading}
            onClick={closeDock}
          >
            {dictionary.dock.allArticles}
          </NavLink>
          <ul className={`${styles.dockList} ${styles.dockListTwoCols}`}>
            {biohackingMenuItems.map(articleItem => (
              <li key={articleItem.id}>
                <NavLink
                  to={buildPath.biohackingDetail(articleItem.id)}
                  className={styles.dockLink}
                  onClick={closeDock}
                >
                  {articleItem.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <Promo
          to={isAuthenticated ? PATHS.PROFILE.PAGE : buildPath.auth()}
          img={promoBio}
          title={dictionary.promo.subscribeCta}
        />
      </div>
    );
  };

  const handleNavLinkClick = () => {
    closeDock();
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
          onClick={handleNavLinkClick}
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
            {LEFT_LINK_KEYS.map(menuKey => (
              <li
                key={menuKey}
                className={styles.navItem}
                onMouseEnter={(e) => onEnterNav(menuKey, e.currentTarget as HTMLElement)}
                aria-haspopup={DROPDOWN_KEYS.includes(menuKey)}
                aria-expanded={dockOpen && activeKey === menuKey}
              >
                <NavLink
                  to={
                    menuKey === "about"
                      ? PATHS.ABOUT
                      : menuKey === "mental"
                        ? PATHS.MENTAL_HEALTH.LIST
                        : menuKey === "tests"
                          ? PATHS.TESTS.LIST
                          : PATHS.BIOHACKING.LIST
                  }
                  className={({isActive}) => `${styles.navLink} ${isActive ? styles.active : ""}`}
                  onClick={handleNavLinkClick}
                >
                  {(() => {
                    switch (menuKey) {
                      case "about": return dictionary.nav.about;
                      case "mental": return dictionary.nav.mental;
                      case "tests": return dictionary.nav.tests;
                      case "biohacking": return dictionary.nav.biohacking;
                      default: return "";
                    }
                  })()}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.actions}>
          <NavLink
            to={profileTo}
            className={styles.iconBtn}
            aria-label={dictionary.nav.profile}
            onClick={handleNavLinkClick}
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
              {lang === "ru" ? dictionary.lang.ru : dictionary.lang.en}
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
                  setLang("ru");
                  setLangOpenTop(false);
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
                  setLang("en");
                  setLangOpenTop(false);
                }}
              >
                {dictionary.lang.en}
              </button>
            </div>
          </div>

          <NavLink
            to={buildPath.supportList()}
            className={styles.cta}
            onClick={handleNavLinkClick}
          >
            {dictionary.nav.sos}
          </NavLink>

          <div className={styles.burgerWrap}>
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
          </div>
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
            {LEFT_LINK_KEYS.map(menuKey => (
              <li key={menuKey}>
                {DROPDOWN_KEYS.includes(menuKey)
                  ? (
                    <>
                      <button
                        type="button"
                        className={`
                        ${styles.drawerLink}
                        ${styles.drawerLinkBtn}
                        ${drawerActive === menuKey ? styles.drawerLinkOpen : ""}`}
                        onClick={() => toggleDrawerSection(menuKey)}
                        aria-expanded={drawerActive === menuKey}
                      >
                        {labelByKey(menuKey)}
                        <span
                          className={`${styles.chevron} ${drawerActive === menuKey ? styles.chevronDown : styles.chevronRight}`}
                          aria-hidden
                        />
                      </button>

                      <ul className={`${styles.submenu} ${drawerActive === menuKey ? styles.submenuOpen : ""}`}>
                        {menuKey === "mental" &&
                        mentalMenuItems.map(mentalItem => (
                          <li key={mentalItem.id}>
                            <NavLink
                              to={buildPath.mentalHealthDetail(mentalItem.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {mentalItem.label}
                            </NavLink>
                          </li>
                        ))}

                        {menuKey === "tests" &&
                        testMenuItems.map(testItem => (
                          <li key={testItem.id}>
                            <NavLink
                              to={buildPath.testsDetail(testItem.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {testItem.label}
                            </NavLink>
                          </li>
                        ))}

                        {menuKey === "biohacking" &&
                        biohackingMenuItems.map(articleItem => (
                          <li key={articleItem.id}>
                            <NavLink
                              to={buildPath.biohackingDetail(articleItem.id)}
                              className={styles.submenuLink}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {articleItem.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  )
                  : (
                    <NavLink
                      to={menuKey === "about" ? PATHS.ABOUT : PATHS.HOME}
                      className={styles.drawerLink}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {labelByKey(menuKey)}
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
              {lang === "ru" ? dictionary.lang.ru : dictionary.lang.en}
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
                  setLang("ru");
                  setLangOpenDrawer(false);
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
                  setLang("en");
                  setLangOpenDrawer(false);
                }}
              >
                {dictionary.lang.en}
              </button>
            </div>
          </div>

          <NavLink
            to={buildPath.supportList()}
            className={styles.cta}
            onClick={() => setDrawerOpen(false)}
          >
            {dictionary.nav.sos}
          </NavLink>

          <NavLink
            to={profileTo}
            className={styles.iconBtn}
            onClick={() => setDrawerOpen(false)}
            aria-label={dictionary.nav.profile}
          >
            <UserRound className={styles.icon} />
          </NavLink>
        </div>
      </aside>

      <NavLink
        to={PATHS.SOS.LIST}
        className={styles.sosFloat}
        aria-label="Страница поддержки"
        onClick={handleNavLinkClick}
      >
        SOS
      </NavLink>
    </header>
  );
}
