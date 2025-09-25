import styles from "src/pages/aboutUsPage/AboutUsPage.module.scss";

export type ContactsData = {
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  telegramLabel: string;
  telegram: string;
  hoursLabel: string;
  hours: string;
};

export function ContactsSection(props: { title: string; data: ContactsData }) {
  const c = props.data;

  return (
    <section
      className={styles.contacts}
      aria-label={props.title}
    >
      <h2 className={styles.sectionTitle}>
        {props.title}
      </h2>
      <ul className={styles.contactList}>
        <li className={styles.contactItem}>
          <span className={styles.contactLabel}>
            {c.emailLabel}
          </span>
          <a
            className={styles.contactLink}
            href={`mailto:${c.email}`}
          >
            {c.email}
          </a>
        </li>
        <li className={styles.contactItem}>
          <span className={styles.contactLabel}>
            {c.phoneLabel}
          </span>
          <a
            className={styles.contactLink}
            href={`tel:${c.phone}`}
          >
            {c.phone}
          </a>
        </li>
        <li className={styles.contactItem}>
          <span className={styles.contactLabel}>
            {c.telegramLabel}
          </span>
          <a
            className={styles.contactLink}
            href={`https://t.me/${c.telegram.replace("@", "")}`}
            target="_blank"
            rel="noreferrer"
          >
            {c.telegram}
          </a>
        </li>
        <li className={styles.contactItem}>
          <span className={styles.contactLabel}>
            {c.hoursLabel}
          </span>
          <span className={styles.contactText}>
            {c.hours}
          </span>
        </li>
      </ul>
    </section>
  );
}
