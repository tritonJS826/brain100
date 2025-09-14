import {Brain, ShieldCheck, Stethoscope, UsersRound} from "lucide-react";
import styles from "src/pages/Homepage/servicesSection/servicesSection.module.scss";

const ID_SERVICES = "services";
const EYEBROW = "Что мы предлагаем";
const TITLE = "Поддержка, основанная на результатах.";
const SUBTITLE =
  "Индивидуальный план, внимание к данным и сопровождение на каждом шаге.";

type Item = {
  title: string;
  text: string;
  Icon: React.ComponentType<{className?: string}>;
};

const ITEMS: ReadonlyArray<Item> = [
  {
    title: "Психиатрия",
    text:
        "Когда нужна медикаментозная поддержка. Быстрый подбор схемы с "
        + "учётом переносимости и эффективности.",
    Icon: Stethoscope,
  },
  {
    title: "Терапия",
    text:
        "Когнитивно-поведенческий подход и практические навыки для "
        + "устойчивых изменений.",
    Icon: Brain,
  },
  {
    title: "Профилактика кризисов",
    text:
        "Протоколы и упражнения для снижения рисков и стабилизации "
        + "состояния.",
    Icon: ShieldCheck,
  },
  {
    title: "Подросткам",
    text:
        "Безопасное пространство и персональная поддержка для "
        + "подростков от 13 лет.",
    Icon: UsersRound,
  },
  {
    title: "Первая помощь",
    text:
        "Советы и техники, которые помогают справиться с острой "
        + "тревогой или панической атакой прямо сейчас.",
    Icon: ShieldCheck,
  },
  {
    title: "Здоровье и энергия",
    text:
        "Рекомендации по сну, питанию и восстановлению ресурса. "
        + "Биохакинг простыми шагами.",
    Icon: Brain,
  },
] as const;

export function ServicesSection() {
  return (
    <section
      id={ID_SERVICES}
      className={styles.services}
      aria-label="Услуги и форматы помощи"
    >
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>
              {EYEBROW}
            </p>
            <h2 className={styles.title}>
              {TITLE}
            </h2>
            <p className={styles.subtitle}>
              {SUBTITLE}
            </p>
          </div>

          <ul className={styles.list}>
            {ITEMS.map(({title, text, Icon}) => (
              <li
                key={title}
                className={styles.card}
              >
                <span className={styles.iconBox}>
                  <Icon className={styles.icon} />
                </span>
                <div className={styles.body}>
                  <h3 className={styles.cardTitle}>
                    {title}
                  </h3>
                  <p className={styles.cardText}>
                    {text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.imageBox}>
          <img
            src="/pictures/men.jpg"
            alt="Человек, получающий поддержку"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
