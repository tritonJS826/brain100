import React, {useCallback, useEffect, useState} from "react";
import {useAtomValue} from "jotai";
import {PhoneCall} from "lucide-react";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import {getUserPersonal, type UserPersonal} from "src/services/profile";
import {getDoctorAvailability} from "src/services/support";
import {accessTokenAtomWithPersistence} from "src/state/authAtom";
import styles from "src/pages/sosPage/SosPage.module.scss";

type SelfhelpItem = {
  id: string;
  link: string;
  title: string;
  desc: string;
};

type SosDictionary = {
  page: { title: string; subtitle: string };
  emergency: { title: string; callNow: string; ariaLabel: string; busyText: string };
  consultation: { title: string; lead: string; cta: string };
  selfhelp: { title: string; lead: string };
  selfhelpItems: SelfhelpItem[];
};

const PAYMENT_URL = "http://localhost:8000/pay";
const NOTICE_TIMEOUT = 5000;

export function SosPage() {
  const dictionary = useDictionary(DictionaryKey.SOS) as SosDictionary | null;

  const accessTokens = useAtomValue(accessTokenAtomWithPersistence);
  const isAuthenticated = Boolean(accessTokens?.token);

  const [userPersonal, setUserPersonal] = useState<UserPersonal | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<number>(0);
  const [noticeMessage, setNoticeMessage] = useState<string>("");

  const isPaidSupportPlan = (userPersonal?.plan ?? "FREE") !== "FREE";

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      try {
        if (isAuthenticated) {
          const personal = await getUserPersonal();
          if (!mounted) {
            return;
          }
          setUserPersonal(personal);
        } else {
          setUserPersonal(null);
        }
      } catch {
        setUserPersonal(null);
      }

      try {
        const count = await getDoctorAvailability();
        if (!mounted) {
          return;
        }
        setAvailableDoctors(count);
      } catch {
        setAvailableDoctors(0);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!noticeMessage) {
      return;
    }
    const messageTime = setTimeout(() => setNoticeMessage(""), NOTICE_TIMEOUT);

    return () => clearTimeout(messageTime);
  }, [noticeMessage]);

  const onUnavailableClick = useCallback((): void => {
    if (!dictionary) {
      return;
    }
    setNoticeMessage(dictionary.emergency.busyText);
  }, [dictionary]);

  const onInternetCallClick = useCallback((): void => {
    setNoticeMessage("Internet call will be available soon.");
    // TODO: real data
  }, []);

  if (!dictionary) {
    return (
      <div className={styles.page}>
        Loading...
      </div>
    );
  }

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
          {!isPaidSupportPlan && PAYMENT_URL && (
            <a
              href={PAYMENT_URL}
              className={`${styles.callNowBtn} ${styles.callNowBad}`}
              aria-label={dictionary.emergency.ariaLabel}
            >
              <PhoneCall
                className={styles.callNowIcon}
                aria-hidden="true"
              />
              {dictionary.emergency.callNow}
            </a>
          )}

          {isPaidSupportPlan && availableDoctors > 0 && (
            <button
              type="button"
              className={`${styles.callNowBtn} ${styles.callNowOk}`}
              aria-label={dictionary.emergency.ariaLabel}
              onClick={onInternetCallClick}
            >
              <PhoneCall
                className={styles.callNowIcon}
                aria-hidden="true"
              />
              {dictionary.emergency.callNow}
            </button>
          )}

          {isPaidSupportPlan && availableDoctors <= 0 && (
            <button
              type="button"
              className={`${styles.callNowBtn} ${styles.callNowBad}`}
              aria-label={dictionary.emergency.ariaLabel}
              onClick={onUnavailableClick}
            >
              <PhoneCall
                className={styles.callNowIcon}
                aria-hidden="true"
              />
              {dictionary.emergency.callNow}
            </button>
          )}
        </div>

        {noticeMessage && <p className={styles.notice}>
          {noticeMessage}
        </p>}
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
