import {
  Brain,
  ClipboardList,
  LifeBuoy,
  MessageSquare,
  PhoneCall,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import styles from "src/pages/Homepage/servicesSection/servicesSection.module.scss";

const ID_SERVICES = "services";
const EYEBROW = "Услуги";
const TITLE = "Поддержка, основанная на данных и простых шагах.";
const SUBTITLE =
  "Диагностика, персональные рекомендации и практики биохакинга. " +
  "Без лекарств. С фокусом на ежедневный прогресс.";

type Item = {
  title: string;
  text: string;
  Icon: React.ComponentType<{className?: string}>;
};

const ITEMS: ReadonlyArray<Item> = [
  {
    title: "Диагностика",
    text:
      "Главный расширенный тест и набор коротких тестов. " +
      "Понимание текущего состояния и персональные рекомендации.",
    Icon: ClipboardList,
  },
  {
    title: "Биохакинг и энергия",
    text:
      "Сон, питание, привычки и восстановление ресурса. " +
      "Простые шаги, которые реально держатся.",
    Icon: Brain,
  },
  {
    title: "SOS / Первая помощь",
    text:
      "Быстрые инструкции при панической атаке и других острых " +
      "состояниях. Подбор горячих линий.",
    Icon: LifeBuoy,
  },
  {
    title: "Консилиум",
    text:
      "Совместное обсуждение сложных случаев и маршрутизация. " +
      "Помогаем выбрать следующий шаг.",
    Icon: UsersRound,
  },
  {
    title: "Консультация специалиста",
    text:
      "Личные консультации, ответы на вопросы, поддержка в " +
      "достижении цели.",
    Icon: MessageSquare,
  },
  {
    title: "Личный кабинет",
    text:
      "История прохождения тестов, персональные советы и " +
      "рассылка на e-mail.",
    Icon: UserRound,
  },
  {
    title: "Горячая кнопка",
    text:
      "Показывает доступность специалиста. Быстрый переход к " +
      "связи и оплате, когда вы готовы.",
    Icon: PhoneCall,
  },
  {
    title: "Практики и материалы",
    text:
      "Подборка упражнений, чек-листов и мини-курсов для " +
      "ежедневной практики.",
    Icon: Sparkles,
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
            {ITEMS.map(({title, text, Icon}) => {
              return (
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
              );
            })}
          </ul>
        </div>

        <div className={styles.imageBox}>
          <img
            src="/pictures/men.jpg"
            alt="Иллюстрация: поддержка и работа с состояниями"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
