import styles from "src/pages/aboutUsPage/AboutUsPage.module.scss";

export type Specialist = {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: readonly string[];
  photoUrl?: string;
  photoAlt?: string;
};

const FIRST_LETTER_COUNT = 1;

function SpecialistCard(props: Specialist) {
  return (
    <li className={styles.card}>
      <div className={styles.avatar}>
        {props.photoUrl
          ? (
            <img
              src={props.photoUrl}
              alt={props.photoAlt || props.name}
              className={styles.avatarImg}
            />
          )
          : (
            <span className={styles.avatarFallback}>
              {props.name.slice(0, FIRST_LETTER_COUNT)}
            </span>
          )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>
          {props.name}
        </h3>
        <p className={styles.cardRole}>
          {props.role}
        </p>
        <p className={styles.cardBio}>
          {props.bio}
        </p>
        {props.skills?.length > 0 && (
          <ul className={styles.tags}>
            {props.skills.map((s: string) => (
              <li
                key={s}
                className={styles.tag}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function SpecialistsSection(props: {
  title: string;
  items: ReadonlyArray<Specialist>;
}) {
  return (
    <section
      className={styles.specs}
      aria-label={props.title}
    >
      <h2 className={styles.sectionTitle}>
        {props.title}
      </h2>
      <ul className={styles.cards}>
        {props.items.map((s) => (
          <SpecialistCard
            key={s.id}
            id={s.id}
            name={s.name}
            role={s.role}
            bio={s.bio}
            skills={s.skills}
            photoUrl={s.photoUrl}
            photoAlt={s.photoAlt}
          />
        ))}
      </ul>
    </section>
  );
}
