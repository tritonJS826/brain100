import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {PATHS} from "src/routes/routes";
import styles from "src/pages/Homepage/HeroSection/HeroSection.module.scss";

const TITLE = "Начните путь к устойчивому спокойствию.";
const SUBTITLE = "Материалы, тесты и специалисты — всё в одном месте, с акцентом на бережную поддержку.";
const BENEFITS = [
  "Короткая диагностика и персональные рекомендации",
  "Консультации специалистов в удобное время",
  "Понятные статьи о состояниях и самопомощи",
  "Практики для восстановления энергии",
] as const;

const CTA_TEXT = "Начать";
const SELECT_PLACEHOLDER = "Я бы хотел(а)…";
const OPTION_TEST_VALUE = "test";
const OPTION_STATES_VALUE = "states";
const OPTION_CONTACT_VALUE = "contact";
const OPTION_TEST_LABEL = "Пройти тест";
const OPTION_STATES_LABEL = "Узнать о состояниях";
const OPTION_CONTACT_LABEL = "Связаться со специалистом";

export function Hero() {
  const [intent, setIntent] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (intent === OPTION_TEST_VALUE) {
      navigate(PATHS.DIAGNOSTICS.LIST);
    } else if (intent === OPTION_STATES_VALUE) {
      navigate(PATHS.MENTAL_HEALTH.LIST);
    } else if (intent === OPTION_CONTACT_VALUE) {
      navigate(PATHS.SPECIALISTS.LIST);
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
          {BENEFITS.map((text) => (
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
              onChange={(e) => setIntent(e.target.value)}
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
