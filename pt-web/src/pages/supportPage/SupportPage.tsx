import React from "react";
import {PhoneCall} from "lucide-react";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {PATHS} from "src/routes/routes";
import styles from "src/pages/supportPage/SupportPage.module.scss";

const hotlineNumber = import.meta.env.VITE_HOTLINE_PHONE as string | undefined;

export function SupportPage() {
  const isAuthenticated = Boolean(localStorage.getItem("accessToken"));
  const telHref = hotlineNumber ? `tel:${hotlineNumber}` : undefined;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Поддержка"
        subtitle={
          "В экстренной ситуации звоните сразу. " +
    "Далее можно отправить заявку на консультацию и почитать материалы по самопомощи."
        }
      />

      <section
        className={styles.cardHero}
        id="emergency"
      >
        <h2 className={styles.cardTitleHero}>
          Экстренная помощь
        </h2>

        <div className={styles.heroRow}>
          <a
            href={telHref}
            className={`${styles.callNowBtn} ${isAuthenticated ? styles.callNowOk : styles.callNowBad}`}
            aria-label="Позвонить на горячую линию"
          >
            <PhoneCall
              className={styles.callNowIcon}
              aria-hidden="true"
            />
            Позвонить на горячую линию
          </a>
        </div>
      </section>

      <section
        className={styles.card}
        id="consultation"
      >
        <h2 className={styles.cardTitle}>
          Консультация со специалистом
        </h2>
        <p className={styles.lead}>
          Оставьте заявку, и мы свяжемся с вами для согласования времени.
        </p>

        <Button to={PATHS.SOS.CONSULTATION}>
          Отправить заявку на консультацию
        </Button>
      </section>

      <section
        className={styles.card}
        id="selfhelp"
      >
        <h2 className={styles.cardTitle}>
          Самопомощь
        </h2>
        <p className={styles.lead}>
          Ознакомьтесь с короткими рекомендациями, чтобы помочь себе в моменте.
        </p>

        <ul className={styles.topics}>
          <li className={styles.topic}>
            <Button to={`${PATHS.MENTAL_HEALTH?.LIST ?? "/mental-health"}#panic-attack`}>
              Паническая атака
            </Button>
            <p className={styles.topicDesc}>
              Как распознать приступ и что делать прямо сейчас.
            </p>
          </li>
          <li className={styles.topic}>
            <Button to={`${PATHS.MENTAL_HEALTH?.LIST ?? "/mental-health"}#anxiety`}>
              Тревога
            </Button>
            <p className={styles.topicDesc}>
              Способы снизить напряжение и вернуть контроль.
            </p>
          </li>
          <li className={styles.topic}>
            <Button to={`${PATHS.MENTAL_HEALTH?.LIST ?? "/mental-health"}#depression`}>
              Депрессия
            </Button>
            <p className={styles.topicDesc}>
              Когда обращаться за помощью и базовые шаги поддержки.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
