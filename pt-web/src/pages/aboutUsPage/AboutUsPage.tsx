import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {ContactsSection} from "src/pages/aboutUsPage/contacts/Contacts";
import {SpecialistsSection} from "src/pages/aboutUsPage/specialists/Specialists";
import styles from "src/pages/aboutUsPage/AboutUsPage.module.scss";

type ProjectBlock = { title: string; text: string };

export function AboutPage() {
  const dict = useDictionary(DictionaryKey.ABOUT);

  if (!dict) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <section
      className={styles.wrap}
      aria-label={dict.sectionAria}
    >
      <header className={styles.head}>
        <p className={styles.eyebrow}>
          {dict.eyebrow}
        </p>
        <h1 className={styles.title}>
          {dict.title}
        </h1>
        <p className={styles.subtitle}>
          {dict.subtitle}
        </p>
      </header>

      <section className={styles.project}>
        <ul className={styles.projectGrid}>
          {dict.project.blocks.map((b: ProjectBlock) => (
            <li
              key={b.title}
              className={styles.projectItem}
            >
              <h2 className={styles.projectTitle}>
                {b.title}
              </h2>
              <p className={styles.projectText}>
                {b.text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <SpecialistsSection
        title={dict.specialistsTitle}
        items={dict.specialists}
      />

      <ContactsSection
        title={dict.contactsTitle}
        data={dict.contacts}
      />
    </section>
  );
}
