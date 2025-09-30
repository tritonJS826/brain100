import React, {useState} from "react";
import {Link} from "react-router-dom";
import {PhoneCall} from "lucide-react";
import {PATHS} from "src/routes/routes";
import {sendConsultationEmail, sendEmergencyEmail} from "src/services/support";
import styles from "src/pages/support/SupportPage.module.scss";

const hotlineNumber = import.meta.env.VITE_HOTLINE_PHONE as string;

export function SupportPage() {
  const [consultationSent, setConsultationSent] = useState<string | null>(null);
  const [consultationError, setConsultationError] = useState<string | null>(null);
  const [emergencySent, setEmergencySent] = useState<string | null>(null);
  const [emergencyError, setEmergencyError] = useState<string | null>(null);

  const onSubmitConsultation: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setConsultationError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const topic = String(data.get("topic") ?? "");
    const preferredAt = String(data.get("preferredAt") ?? "");
    const message = String(data.get("message") ?? "");
    try {
      const id = await sendConsultationEmail({name, email, phone, topic, preferredAt, message});
      setConsultationSent(id);
      form.reset();
    } catch {
      setConsultationError("Не удалось отправить заявку. Попробуйте снова.");
    }
  };

  const onSubmitEmergency: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setEmergencyError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const urgent = true;
    try {
      const id = await sendEmergencyEmail({name, phone, urgent});
      setEmergencySent(id);
      form.reset();
    } catch {
      setEmergencyError("Не удалось отправить запрос. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Поддержка
        </h1>
        <p className={styles.subtitle}>
          В экстренной ситуации звоните сразу. Ниже можно оставить заявку на консультацию и почитать материалы по состояниям.
        </p>
      </div>

      <section
        className={styles.cardHero}
        id="emergency"
      >
        <div className={styles.heroGrid}>
          <div className={styles.heroCol}>
            <h2 className={styles.cardTitleHero}>
              Экстренная помощь
            </h2>
            <a
              className={styles.callNowBtn}
              href={hotlineNumber ? `tel:${hotlineNumber}` : undefined}
            >
              <PhoneCall
                className={styles.callNowIcon}
                aria-hidden="true"
              />
              Позвонить на горячую линию
            </a>
          </div>

          <div className={styles.heroCol}>
            <h3 className={styles.cardTitleSmall}>
              Заказать звонок
            </h3>

            {emergencySent
              ? (
                <div className={styles.result}>
                  <div className={styles.resultTitle}>
                    Запрос отправлен
                  </div>
                  <div className={styles.resultText}>
                    Номер запроса:
                    {" "}
                    {emergencySent}
                    . Мы перезвоним как можно скорее.
                  </div>
                </div>
              )
              : (
                <form
                  className={styles.formStack}
                  onSubmit={onSubmitEmergency}
                  noValidate
                >
                  <label className={styles.label}>
                    Имя*
                    <input
                      className={styles.input}
                      name="name"
                      required
                      minLength={2}
                      autoComplete="name"
                    />
                  </label>

                  <label className={styles.label}>
                    Телефон*
                    <input
                      className={styles.input}
                      name="phone"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </label>

                  {emergencyError && <div className={styles.err}>
                    {emergencyError}
                  </div>}

                  <button
                    className={styles.submitHero}
                    type="submit"
                  >
                    Жду звонка
                  </button>
                </form>
              )}
          </div>
        </div>
      </section>

      <section
        className={styles.card}
        id="consultation"
      >
        <h2 className={styles.cardTitle}>
          Заявка на консультацию
        </h2>

        {consultationSent
          ? (
            <div className={styles.result}>
              <div className={styles.resultTitle}>
                Заявка отправлена
              </div>
              <div className={styles.resultText}>
                Номер заявки:
                {" "}
                {consultationSent}
                . Мы свяжемся с вами.
              </div>
              <Link
                to={PATHS.HOME}
                className={styles.linkBtn}
              >
                На главную
              </Link>
            </div>
          )
          : (
            <form
              className={styles.form}
              onSubmit={onSubmitConsultation}
              noValidate
            >
              <label className={styles.label}>
                Имя*
                <input
                  className={styles.input}
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </label>

              <label className={styles.label}>
                Email*
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>

              <label className={styles.label}>
                Телефон
                <input
                  className={styles.input}
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>

              <label className={styles.label}>
                Тема запроса*
                <input
                  className={styles.input}
                  name="topic"
                  required
                  minLength={2}
                  placeholder="Например: тревога, паническая атака…"
                />
              </label>

              <label className={styles.label}>
                Предпочтительное время
                <input
                  className={styles.input}
                  name="preferredAt"
                  placeholder="Например: после 18:00, в выходные…"
                />
              </label>

              <label className={styles.label}>
                Сообщение
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={5}
                  maxLength={2000}
                />
              </label>

              {consultationError && <div className={styles.err}>
                {consultationError}
              </div>}

              <button
                className={styles.submit}
                type="submit"
              >
                Отправить
              </button>
            </form>
          )}
      </section>

      <section
        className={styles.card}
        id="topics"
      >
        <h2 className={styles.cardTitle}>
          Быстрые темы
        </h2>
        <p className={styles.lead}>
          Короткие материалы, которые помогут до консультации.
        </p>

        <ul className={styles.topics}>
          <li className={styles.topic}>
            <Link
              to={`${PATHS.MENTAL_HEALTH.LIST}#panic-attack`}
              className={styles.topicLink}
            >
              Паническая атака
            </Link>
            <p className={styles.topicDesc}>
              Что это, как помочь себе сейчас и как снизить вероятность повторения.
            </p>
          </li>
          <li className={styles.topic}>
            <Link
              to={`${PATHS.MENTAL_HEALTH.LIST}#anxiety`}
              className={styles.topicLink}
            >
              Тревога
            </Link>
            <p className={styles.topicDesc}>
              Понимание тревоги, дыхательные практики и маленькие шаги на день.
            </p>
          </li>
          <li className={styles.topic}>
            <Link
              to={`${PATHS.MENTAL_HEALTH.LIST}#depression`}
              className={styles.topicLink}
            >
              Депрессия
            </Link>
            <p className={styles.topicDesc}>
              Симптомы, когда обращаться за помощью и базовые стратегии поддержки.
            </p>
          </li>
        </ul>

        <Link
          to={PATHS.MENTAL_HEALTH.LIST}
          className={styles.linkBtn}
        >
          Все материалы о состояниях
        </Link>
      </section>
    </div>
  );
}
