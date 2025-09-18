import men from "src/assets/pictures/men.avif";
import {useInView} from "src/hooks/useInView";
import styles from "src/pages/homePage/servicesSection/ServicesSection.module.scss";

const ID_SERVICES = "services";
const EYEBROW = "Услуги";
const TITLE = "Поддержка, основанная на данных и простых шагах.";
const SUBTITLE =
  "Диагностика, персональные рекомендации и практики биохакинга. Без лекарств. С фокусом на ежедневный прогресс.";

const IN_VIEW_THRESHOLD = 0.2;

type Item = { title: string; text: string };

const ITEMS: ReadonlyArray<Item> = [
  {
    title: "Диагностика",
    text:
      "Главный расширенный тест и набор коротких тестов. " +
      "Понимание текущего состояния и персональные рекомендации.",
  },
  {
    title: "Биохакинг и энергия",
    text:
      "Сон, питание, привычки и восстановление ресурса. " +
      "Простые шаги, которые действительно приживаются.",
  },
  {
    title: "SOS / Первая помощь",
    text:
      "Быстрые инструкции при панической атаке и других острых состояниях. " +
      "Подбор горячих линий.",
  },
  {
    title: "Консультации специалистов",
    text:
      "Личные консультации, ответы на вопросы, поддержка в достижении цели.",
  },
];

export function ServicesSection() {
  const {ref, inView} = useInView(IN_VIEW_THRESHOLD);

  return (
    <section
      id={ID_SERVICES}
      ref={ref}
      className={`${styles.services} ${inView ? styles.visible : ""}`}
      aria-label="Услуги и форматы помощи"
    >
      <div className={styles.wrapper}>
        <div className={styles.textBlock}>
          <p className={styles.eyebrow}>
            {EYEBROW}
          </p>
          <h2 className={styles.title}>
            {TITLE}
          </h2>
          <p className={styles.subtitle}>
            {SUBTITLE}
          </p>

          <ul className={styles.list}>
            {ITEMS.map(({title, text}) => (
              <li
                key={title}
                className={styles.item}
              >
                <h3 className={styles.itemTitle}>
                  {title}
                </h3>
                <p className={styles.itemText}>
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.imageBox}>
          <img
            src={men}
            alt="Иллюстрация: поддержка и работа с состояниями"
            className={styles.image}
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
