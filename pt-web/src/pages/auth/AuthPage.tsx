import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {login, LoginPayload, register as apiRegister, RegisterPayload} from "src/services/auth";
import {z} from "zod";
import styles from "src/pages/auth/AuthPage.module.scss";

const minimalPasswordLength = 6;
const minimalNameLength = 2;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(minimalPasswordLength),
});

const registerSchema = z
  .object({
    name: z.string().min(minimalNameLength),
    email: z.string().email(),
    password: z.string().min(minimalPasswordLength),
    confirmPassword: z.string().min(minimalPasswordLength),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

type RegisterFormData = RegisterPayload & { confirmPassword: string };

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [errorText, setErrorText] = useState<string | null>(null);

  const loginForm = useForm<LoginPayload>({resolver: zodResolver(loginSchema)});
  const registerForm = useForm<RegisterFormData>({resolver: zodResolver(registerSchema)});

  const onLoginSubmit = async (formData: LoginPayload) => {
    setErrorText(null);
    try {
      await login(formData);
      window.location.assign("/profile");
    } catch {
      setErrorText("Ошибка входа. Проверьте данные и попробуйте снова.");
    }
  };

  const onRegisterSubmit = async (formData: RegisterFormData) => {
    setErrorText(null);
    try {
      const payload: RegisterPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      await apiRegister(payload);
      window.location.assign("/profile");
    } catch {
      setErrorText("Не удалось создать аккаунт. Попробуйте снова.");
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("login")}
            type="button"
          >
            Вход
          </button>
          <button
            className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("register")}
            type="button"
          >
            Регистрация
          </button>
        </div>

        {activeTab === "login" && (
          <form
            className={styles.form}
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            noValidate
          >
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email && (
                <span className={styles.errorText}>
                  {loginForm.formState.errors.email.message}
                </span>
              )}
            </label>

            <label className={styles.label}>
              Пароль
              <input
                className={styles.input}
                type="password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <span className={styles.errorText}>
                  {loginForm.formState.errors.password.message}
                </span>
              )}
            </label>

            {errorText && <div className={styles.errorText}>
              {errorText}
            </div>}

            <button
              className={styles.submit}
              type="submit"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting ? "Входим…" : "Войти"}
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form
            className={styles.form}
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            noValidate
          >
            <label className={styles.label}>
              Имя
              <input
                className={styles.input}
                {...registerForm.register("name")}
              />
              {registerForm.formState.errors.name && (
                <span className={styles.errorText}>
                  {registerForm.formState.errors.name.message}
                </span>
              )}
            </label>

            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                {...registerForm.register("email")}
              />
              {registerForm.formState.errors.email && (
                <span className={styles.errorText}>
                  {registerForm.formState.errors.email.message}
                </span>
              )}
            </label>

            <label className={styles.label}>
              Пароль
              <input
                className={styles.input}
                type="password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <span className={styles.errorText}>
                  {registerForm.formState.errors.password.message}
                </span>
              )}
            </label>

            <label className={styles.label}>
              Подтверждение пароля
              <input
                className={styles.input}
                type="password"
                {...registerForm.register("confirmPassword")}
              />
              {registerForm.formState.errors.confirmPassword && (
                <span className={styles.errorText}>
                  {registerForm.formState.errors.confirmPassword.message}
                </span>
              )}
            </label>

            {errorText && <div className={styles.errorText}>
              {errorText}
            </div>}

            <button
              className={styles.submit}
              type="submit"
              disabled={registerForm.formState.isSubmitting}
            >
              {registerForm.formState.isSubmitting ? "Создаём…" : "Создать аккаунт"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
