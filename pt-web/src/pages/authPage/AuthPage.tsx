import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {PATHS} from "src/routes/routes";
import {loginByEmail, registerByEmail} from "src/services/auth";
import styles from "src/pages/authPage/AuthPage.module.scss";

type AuthDictionary = {
  tabs: { login: string; register: string };
  title: { login: string; register: string };
  subtitle: { login: string; register: string };
  fields: { fullName: string; email: string; password: string; passwordRepeat: string };
  placeholders: { fullName: string; email: string; password: string; passwordRepeat: string };
  errors: { nameRequired: string; passwordsMismatch: string; requestFailed: string };
  buttons: { submitLogin: string; submitRegister: string; loading: string };
};

export function AuthPage() {
  const navigate = useNavigate();
  const dictionary = useDictionary(DictionaryKey.AUTH) as AuthDictionary | null;

  const [mode, setMode] = useState<"login" | "register">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!dictionary) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  const isRegister = mode === "register";

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (loading) {
      return;
    }

    setError(null);

    if (isRegister) {
      if (!fullName.trim()) {
        setError(dictionary.errors.nameRequired);

        return;
      }
      if (password !== password2) {
        setError(dictionary.errors.passwordsMismatch);

        return;
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        await registerByEmail(email, password, fullName.trim());
      } else {
        await loginByEmail(email, password);
      }
      navigate(PATHS.PROFILE.PAGE, {replace: true});
    } catch (err) {
      const message = err instanceof Error ? err.message : dictionary.errors.requestFailed;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
            disabled={loading}
          >
            {dictionary.tabs.login}
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => setMode("register")}
            disabled={loading}
          >
            {dictionary.tabs.register}
          </button>
        </div>

        <header className={styles.head}>
          <h1 className={styles.title}>
            {isRegister ? dictionary.title.register : dictionary.title.login}
          </h1>
          <p className={styles.subtitle}>
            {isRegister ? dictionary.subtitle.register : dictionary.subtitle.login}
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          className={styles.form}
          noValidate
        >
          {isRegister && (
            <label className={styles.label}>
              {dictionary.fields.fullName}
              <input
                className={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.currentTarget.value)}
                autoComplete="name"
                placeholder={dictionary.placeholders.fullName}
                minLength={2}
                required
              />
            </label>
          )}

          <label className={styles.label}>
            {dictionary.fields.email}
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              autoComplete="email"
              placeholder={dictionary.placeholders.email}
              required
            />
          </label>

          <label className={styles.label}>
            {dictionary.fields.password}
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder={dictionary.placeholders.password}
              minLength={6}
              required
            />
          </label>

          {isRegister && (
            <label className={styles.label}>
              {dictionary.fields.passwordRepeat}
              <input
                type="password"
                className={styles.input}
                value={password2}
                onChange={(e) => setPassword2(e.currentTarget.value)}
                autoComplete="new-password"
                placeholder={dictionary.placeholders.passwordRepeat}
                minLength={6}
                required
              />
            </label>
          )}

          {error && <div className={styles.err}>
            {error}
          </div>}

          <button
            type="submit"
            className={styles.submit}
            disabled={loading}
          >
            {loading
              ? dictionary.buttons.loading
              : isRegister
                ? dictionary.buttons.submitRegister
                : dictionary.buttons.submitLogin}
          </button>
        </form>
      </div>
    </div>
  );
}
