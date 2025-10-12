import React, {useState} from "react";
import {Link} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import {sendConsultationEmail} from "src/services/support";
import styles from "src/pages/sosPage/SosConsultationPage/SosConsultationPage.module.scss";

type SosFormDictionary = {
  title: string;
  subtitle: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    topic: string;
    preferredAt: string;
    message: string;
  };
  placeholders: {
    phone: string;
    topic: string;
    preferredAt: string;
    message: string;
  };
  submit: string;
  backToSupport: string;
  sentTitle: string;
  sentTextPrefix: string;
  sentTextSuffix: string;
  goHome: string;
  goSupport: string;
  error: string;
};

type SosDictionary = {
  form: SosFormDictionary;
};

export function SosConsultationPage() {
  const dictionary = useDictionary(DictionaryKey.SOS) as SosDictionary | null;

  const [sentId, setSentId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!dictionary) {
    return (
      <div className={styles.page}>
        Loading...
      </div>
    );
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!isSubmitting) {
      setSendError(null);
      setIsSubmitting(true);

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
        setSentId(id);
        form.reset();
      } catch {
        setSendError(dictionary.form.error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className={styles.page}>
      {!sentId && (
        <header className={styles.header}>
          <h1 className={styles.title}>
            {dictionary.form.title}
          </h1>
          <p className={styles.subtitle}>
            {dictionary.form.subtitle}
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
                {dictionary.form.labels.name}
                <input
                  className={styles.input}
                  name="name"
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </label>

              <label className={styles.label}>
                {dictionary.form.labels.email}
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>

              <label className={styles.label}>
                {dictionary.form.labels.phone}
                <input
                  className={styles.input}
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder={dictionary.form.placeholders.phone}
                />
              </label>

              <label className={styles.label}>
                {dictionary.form.labels.topic}
                <input
                  className={styles.input}
                  name="topic"
                  required
                  minLength={2}
                  placeholder={dictionary.form.placeholders.topic}
                />
              </label>

              <label className={styles.label}>
                {dictionary.form.labels.preferredAt}
                <input
                  className={styles.input}
                  name="preferredAt"
                  placeholder={dictionary.form.placeholders.preferredAt}
                />
              </label>

              <label className={styles.label}>
                {dictionary.form.labels.message}
                <textarea
                  className={styles.textarea}
                  name="message"
                  rows={6}
                  maxLength={2000}
                  placeholder={dictionary.form.placeholders.message}
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
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                >
                  {isSubmitting ? "…" : dictionary.form.submit}
                </button>

                <Link
                  to={PATHS.SOS.CONSULTATION}
                  className={styles.secondary}
                >
                  {dictionary.form.backToSupport}
                </Link>
              </div>
            </form>
          )
          : (
            <div className={styles.result}>
              <div className={styles.resultTitle}>
                {dictionary.form.sentTitle}
              </div>
              <div className={styles.resultText}>
                {dictionary.form.sentTextPrefix}
                {" "}
                {sentId}
                .
                {" "}
                {dictionary.form.sentTextSuffix}
              </div>

              <div className={styles.resultActions}>
                <Link
                  to={PATHS.HOME}
                  className={styles.linkBtn}
                >
                  {dictionary.form.goHome}
                </Link>
                <Link
                  to={PATHS.SOS.CONSULTATION}
                  className={styles.linkBtn}
                >
                  {dictionary.form.goSupport}
                </Link>
              </div>
            </div>
          )}
      </section>
    </div>
  );
}
