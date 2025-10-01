/* eslint-disable max-len */
import React, {useState} from "react";
import styles from "src/pages/authPage/AuthPage.module.scss";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_OAUTH_URL =
  import.meta.env.VITE_AUTH_GOOGLE_URL || (API_BASE ? `${API_BASE}/auth/google` : "/auth/google");

export function AuthPage() {
  const [loading, setLoading] = useState(false);

  const onGoogleClick = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    window.location.assign(GOOGLE_OAUTH_URL);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <header className={styles.head}>
          <h1 className={styles.title}>
            Вход в аккаунт
          </h1>
          <p className={styles.subtitle}>
            Продолжите через Google
          </p>
        </header>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={onGoogleClick}
          disabled={loading}
          aria-label="Войти через Google"
        >
          <span
            className={styles.googleMark}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 48 48"
              className={styles.googleSvg}
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.5 7.1 29 5 24 5 12.9 5 4 13.9 4 25s8.9 20 20 20 20-8.9 20-20c0-1.5-.2-3-.4-4.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.9C14.7 16.3 18.9 13 24 13c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.5 7.1 29 5 24 5 16.1 5 9.3 9.6 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 45c5 0 9.5-1.9 12.9-5l-6-4.9C29 36.8 26.6 38 24 38c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.3 40.4 16.1 45 24 45z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.4 5.7l6 4.9C39.7 35.9 44 30.9 44 23.9c0-1.2-.2-2.4-.4-3.4z"
              />
            </svg>
          </span>
          <span className={styles.googleText}>
            {loading ? "Переходим к Google…" : "Продолжить с Google"}
          </span>
        </button>

        <p className={styles.note}>
          Нажимая кнопку, вы соглашаетесь с условиями сервиса и обработкой персональных данных.
        </p>
      </div>
    </div>
  );
}
