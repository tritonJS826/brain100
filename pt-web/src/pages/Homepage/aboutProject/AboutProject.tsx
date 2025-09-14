import {Calendar, Clock, HeartHandshake, LifeBuoy, Sparkles, Target} from "lucide-react";
import styles from "src/pages/Homepage/aboutProject/AboutProject.module.scss";

const ID_ABOUT = "about";
const EYEBROW = "О проекте";
const TITLE = "Забота о психическом здоровье просто и доступно.";
const SUBTITLE =
  "Мы помогаем увидеть прогресс на каждом шаге: от первой диагностики " +
  "до устойчивого результата.";

type Feature = {title: string; text: string; Icon: React.ComponentType<{className?: string}>};

const FEATURES: ReadonlyArray<Feature> = [
  {title: "Быстрая помощь", text: "Доступ к поддержке и материалам в кратчайшие сроки.", Icon: Calendar},
  {title: "Индивидуальные планы", text: "Рекомендации и шаги под ваши цели и ритм жизни.", Icon: Target},
  {title: "Первая помощь", text: "Пошаговые инструкции и упражнения в острых ситуациях.", Icon: LifeBuoy},
  {title: "Сопровождение 1:1", text: "Личный формат взаимодействия от старта до результата.", Icon: HeartHandshake},
  {title: "Время на вашу сторону", text: "Гибкий формат: поддержка тогда, когда удобно вам.", Icon: Clock},
  {title: "Здоровье и энергия", text: "Практики восстановления сна, питания и привычек.", Icon: Sparkles},
];

export function AboutProject() {
  return (
    <section
      id={ID_ABOUT}
      className={styles.about}
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
        {FEATURES.map(({title, text, Icon}) => {
          return (
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
          );
        })}
      </ul>
    </section>
  );
}
