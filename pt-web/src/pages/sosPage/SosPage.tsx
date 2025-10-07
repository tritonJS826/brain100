import React from "react";
import {useAtomValue} from "jotai";
import {PhoneCall} from "lucide-react";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import {accessTokenAtomWithPersistence} from "src/state/authAtom";
import styles from "src/pages/sosPage/SosPage.module.scss";

const hotlineNumber = import.meta.env.VITE_HOTLINE_PHONE as string | undefined;

type SelfhelpItem = { id: string; link: string; title: string; desc: string };
type SosDictionary = {
  page: { title: string; subtitle: string };
  emergency: { title: string; callNow: string; ariaLabel: string };
  consultation: { title: string; lead: string; cta: string };
  selfhelp: { title: string; lead: string };
  selfhelpItems: SelfhelpItem[];
};

export function SosPage() {
  const dictionary = useDictionary(DictionaryKey.SOS) as SosDictionary | null;

  const access = useAtomValue(accessTokenAtomWithPersistence);
  const isAuthenticated = Boolean(access?.token);

  if (!dictionary) {
    return (
      <div className={styles.page}>
        Loading...
      </div>
    );
  }

  const telHref = hotlineNumber ? `tel:${hotlineNumber}` : undefined;

  return (
    <div className={styles.page}>
      <PageHeader
        title={dictionary.page.title}
        subtitle={dictionary.page.subtitle}
      />

      <section
        className={styles.cardHero}
        id="emergency"
      >
        <h2 className={styles.cardTitleHero}>
          {dictionary.emergency.title}
        </h2>
        <div className={styles.heroRow}>
          <a
            href={telHref}
            className={`${styles.callNowBtn} ${isAuthenticated ? styles.callNowOk : styles.callNowBad}`}
            aria-label={dictionary.emergency.ariaLabel}
          >
            <PhoneCall
              className={styles.callNowIcon}
              aria-hidden="true"
            />
            {dictionary.emergency.callNow}
          </a>
        </div>
      </section>

      <section
        className={styles.card}
        id="consultation"
      >
        <h2 className={styles.cardTitle}>
          {dictionary.consultation.title}
        </h2>
        <p className={styles.lead}>
          {dictionary.consultation.lead}
        </p>
        <Button to={PATHS.SOS.CONSULTATION}>
          {dictionary.consultation.cta}
        </Button>
      </section>

      <section
        className={styles.card}
        id="selfhelp"
      >
        <h2 className={styles.cardTitle}>
          {dictionary.selfhelp.title}
        </h2>
        <p className={styles.lead}>
          {dictionary.selfhelp.lead}
        </p>
        <ul className={styles.topics}>
          {dictionary.selfhelpItems.map((item) => (
            <li
              key={item.id}
              className={styles.topic}
            >
              <Button to={`${PATHS.CONDITIONS.LIST}${item.link}`}>
                {item.title}
              </Button>
              <p className={styles.topicDesc}>
                {item.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
