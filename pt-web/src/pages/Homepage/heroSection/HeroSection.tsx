import {useState} from "react";
import styles from "src/pages/Homepage/heroSection/HeroSection.module.scss";

const TITLE = "Здесь начинается путь к спокойствию.";
const SUBTITLE = "Персональная поддержка и ресурсы для психического здоровья.";
const BENEFITS = [
  "Бесплатная диагностика и индивидуальный план",
  "Поддержка специалиста в удобное время",
  "Простые тесты и полезные статьи",
  "Советы по восстановлению энергии",
] as const;

const CTA_TEXT = "Начать";
const SELECT_PLACEHOLDER = "Я бы хотел(а)…";
const OPTION_TEST_VALUE = "test";
const OPTION_STATES_VALUE = "states";
const OPTION_CONTACT_VALUE = "contact";
const OPTION_TEST_LABEL = "Пройти тест";
const OPTION_STATES_LABEL = "Узнать о состояниях";
const OPTION_CONTACT_LABEL = "Связаться со специалистом";

const TARGET_DIAGNOSTICS = "diagnostics";
const TARGET_STATES = "mental-health";
const TARGET_CONTACTS = "contacts";

function navigateToId(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  } else {
    window.location.hash = `#${id}`;
  }
}

export function Hero() {
  const [intent, setIntent] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (intent === OPTION_TEST_VALUE) {
      navigateToId(TARGET_DIAGNOSTICS);
    } else if (intent === OPTION_STATES_VALUE) {
      navigateToId(TARGET_STATES);
    } else if (intent === OPTION_CONTACT_VALUE) {
      navigateToId(TARGET_CONTACTS);
    }
  };

  return (
    <section
      className={styles.hero}
      aria-label="Вступительный блок"
    >
      <div className={styles.heroContent}>
        <p className={styles.heroEyebrow}>
          Онлайн-поддержка психического здоровья
        </p>

        <h1 className={styles.heroTitle}>
          {TITLE}
        </h1>

        <p className={styles.heroSubtitle}>
          {SUBTITLE}
        </p>

        <ul className={styles.heroList}>
          {BENEFITS.map(text => (
            <li
              key={text}
              className={styles.heroListItem}
            >
              {text}
            </li>
          ))}
        </ul>

        <form
          className={styles.heroCta}
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="hero-intent"
            className={styles.heroLabel}
          >
            С чего начнём сегодня?
          </label>

          <div className={styles.heroControls}>
            <select
              id="hero-intent"
              className={styles.heroSelect}
              value={intent}
              onChange={e => setIntent(e.target.value)}
            >
              <option
                value=""
                disabled
              >
                {SELECT_PLACEHOLDER}
              </option>
              <option value={OPTION_TEST_VALUE}>
                {OPTION_TEST_LABEL}
              </option>
              <option value={OPTION_STATES_VALUE}>
                {OPTION_STATES_LABEL}
              </option>
              <option value={OPTION_CONTACT_VALUE}>
                {OPTION_CONTACT_LABEL}
              </option>
            </select>

            <button
              type="submit"
              className={styles.heroButton}
            >
              {CTA_TEXT}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
