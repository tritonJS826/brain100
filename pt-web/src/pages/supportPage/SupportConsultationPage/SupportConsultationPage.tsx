import React, {useState} from "react";
import {Link} from "react-router-dom";
import {PATHS} from "src/routes/routes";
import {sendConsultationEmail} from "src/services/support";
import styles from "src/pages/supportPage/SupportConsultationPage/SupportConsultationPage.module.scss";

export function SupportConsultationPage() {
  const [sentId, setSentId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setSendError(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name"));
    const email = String(data.get("email"));
    const phone = String(data.get("phone"));
    const topic = String(data.get("topic"));
    const preferredAt = String(data.get("preferredAt"));
    const message = String(data.get("message"));

    try {
      const id = await sendConsultationEmail({
        name,
        email,
        phone,
        topic,
        preferredAt,
        message,
      });
      setSentId(id);
      form.reset();
    } catch {
      setSendError("Не удалось отправить заявку. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.page}>
      {!sentId && (
        <header className={styles.header}>
          <h1 className={styles.title}>
            Заявка на консультацию
          </h1>
          <p className={styles.subtitle}>
            Заполните форму ниже. Мы свяжемся с вами и подберём удобное время.
          </p>
        </header>
      )}

      <section className={styles.card}>
        {!sentId
          ? (
            <form
              className={styles.form}
              onSubmit={onSubmit}
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
                  placeholder="По желанию"
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
                  placeholder="Например: после 18:00 или в выходные"
                />
              </label>

              <label className={styles.label}>
                Сообщение
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={6}
                  maxLength={2000}
                  placeholder="Коротко опишите запрос или задачу"
                />
              </label>

              {sendError && (
                <div className={styles.err}>
                  {sendError}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.submit}
                  type="submit"
                >
                  Отправить заявку
                </button>

                <Link
                  to={PATHS.SOS.CONSULTATION}
                  className={styles.secondary}
                >
                  Назад к поддержке
                </Link>
              </div>
            </form>
          )
          : (
            <div className={styles.result}>
              <div className={styles.resultTitle}>
                Заявка отправлена
              </div>
              <div className={styles.resultText}>
                Номер заявки:
                {" "}
                {sentId}
                . Мы свяжемся с вами.
              </div>

              <div className={styles.resultActions}>
                <Link
                  to={PATHS.HOME}
                  className={styles.linkBtn}
                >
                  На главную
                </Link>
                <Link
                  to={PATHS.SOS.CONSULTATION}
                  className={styles.linkBtn}
                >
                  В поддержку
                </Link>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}

