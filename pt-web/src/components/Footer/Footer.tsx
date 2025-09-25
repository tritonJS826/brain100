import {Link} from "react-router-dom";
import {Facebook, Instagram, Linkedin, Twitter} from "lucide-react";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import styles from "src/components/Footer/Footer.module.scss";

const SOCIALS = [
  {href: "https://twitter.com", Icon: Twitter, label: "Twitter"},
  {href: "https://facebook.com", Icon: Facebook, label: "Facebook"},
  {href: "https://instagram.com", Icon: Instagram, label: "Instagram"},
  {href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn"},
] as const;

export function Footer() {
  const dict = useDictionary(DictionaryKey.COMMON);
  if (!dict) {
    return null;
  }

  const COL_1 = {
    title: dict.footer.sectionsTitle,
    links: [
      {label: dict.footer.links.about, to: PATHS.ABOUT},
      {label: dict.footer.links.states, to: PATHS.MENTAL_HEALTH.LIST},
      {label: dict.footer.links.tests, to: PATHS.DIAGNOSTICS.LIST},
      {label: dict.footer.links.support, to: PATHS.SOS.LIST},
    ],
  } as const;

  const COL_2 = {
    title: dict.footer.aboutTitle,
    links: [
      {label: dict.footer.links.projectInfo, to: PATHS.ABOUT},
      {label: dict.footer.links.specialists, to: PATHS.SPECIALISTS.LIST},
      {label: dict.footer.links.contacts, to: PATHS.CONTACTS},
      {label: dict.footer.links.profile, to: PATHS.PROFILE.PAGE},
    ],
  } as const;

  const COL_3 = {
    title: dict.footer.resourcesTitle,
    links: [
      {label: dict.footer.links.statesCatalog, to: PATHS.MENTAL_HEALTH.LIST},
      {label: dict.footer.links.testsCatalog, to: PATHS.DIAGNOSTICS.LIST},
      {label: dict.footer.links.biohackingCatalog, to: PATHS.BIOHACKING.LIST},
      {label: dict.footer.links.supportAndSos, to: PATHS.SOS.LIST},
    ],
  } as const;

  return (
    <footer
      className={styles.footer}
      aria-label={dict.footer.ariaFooter}
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
          aria-label={dict.footer.socialsAria}
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
          {dict.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
