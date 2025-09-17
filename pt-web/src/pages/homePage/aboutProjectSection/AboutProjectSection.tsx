import {Calendar, Clock, HeartHandshake, LifeBuoy, Sparkles, Target} from "lucide-react";
import {useInView} from "src/hooks/useInView";
import styles from "src/pages/homePage/aboutProjectSection/AboutProjectSection.module.scss";

const ID_ABOUT = "about";

const EYEBROW = "О проекте";
const TITLE = "Поддержка психического здоровья — понятно, бережно, рядом.";
const SUBTITLE = `Мы соединяем диагностику, простые упражнения, статьи и помощь специалистов.
От первого шага до устойчивого результата — в удобном формате и темпе.`;

const IN_VIEW_THRESHOLD = 0.2;

type Feature = {title: string; text: string; Icon: React.ComponentType<{className?: string}>};

const FEATURES: ReadonlyArray<Feature> = [
  {
    title: "Быстрый старт",
    text: "Короткая первичная диагностика и рекомендации уже в день обращения.",
    Icon: Calendar,
  },
  {
    title: "Личный план",
    text: "Пошаговые цели и практики под ваш ритм жизни и запрос.",
    Icon: Target,
  },
  {
    title: "SOS-помощь",
    text: "Паническая атака, острая тревога, выгорание — инструкции и упражнения здесь и сейчас.",
    Icon: LifeBuoy,
  },
  {
    title: "Сопровождение 1:1",
    text: "Команда специалистов. Запись на консультации и консилиум при необходимости.",
    Icon: HeartHandshake,
  },
  {
    title: "Когда удобно вам",
    text: "Гибкий график и онлайн-формат. Напоминания и трекинг прогресса.",
    Icon: Clock,
  },
  {
    title: "Здоровье и энергия",
    text: "Сон, питание, привычки, восстановление — практики биохакинга с доказанной пользой.",
    Icon: Sparkles,
  },
];

export function AboutProjectSection() {
  const {ref, inView} = useInView(IN_VIEW_THRESHOLD);

  return (
    <section
      id={ID_ABOUT}
      ref={ref}
      className={`${styles.about} ${styles.section} ${inView ? styles.visible : ""}`}
      aria-label="О проекте"
    >
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

      <ul className={styles.grid}>
        {FEATURES.map(({title, text, Icon}) => (
          <li
            key={title}
            className={styles.item}
          >
            <span className={styles.iconBox}>
              <Icon className={styles.icon} />
            </span>

            <div className={styles.body}>
              <h3 className={styles.itemTitle}>
                {title}
              </h3>
              <p className={styles.itemText}>
                {text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
