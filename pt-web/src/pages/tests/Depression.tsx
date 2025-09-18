import {useState} from "react";
import styles from "src/pages/tests/Depression.module.scss";

type Question =
  | {type: "text"; name: string; label: string; placeholder?: string}
  | {type: "radio"; name: string; label: string; options: string[]}
  | {type: "checkbox"; name: string; label: string; options: string[]};

export const QUESTION_NUM_1 = 1;
export const QUESTION_NUM_2 = 2;
export const QUESTION_NUM_3 = 3;

export const QUESTION_1: Question = {
  type: "text",
  name: "sleep",
  label: "Как вы спали прошлой ночью?",
  placeholder: "Например: хорошо / 7 часов",
};

export const QUESTION_2: Question = {
  type: "radio",
  name: "mood",
  label: "Настроение сейчас",
  options: ["Спокойное", "Напряжённое", "Радостное"],
};

export const QUESTION_3: Question = {
  type: "checkbox",
  name: "helps",
  label: "Что помогало сегодня? (можно несколько)",
  options: ["Сон", "Прогулка", "Разговор с близким", "Упражнения"],
};

export const DUMMY_QUESTIONS: Question[] = [QUESTION_1, QUESTION_2, QUESTION_3];

export function Depression() {
  const [formData, setFormData] = useState<Record<string, string | string[]>>(
    {},
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target;

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      const {checked} = e.target;
      setFormData(prev => {
        const oldValues = (prev[name] as string[]) || [];

        return {
          ...prev,
          [name]: checked
            ? [...oldValues, value]
            : oldValues.filter(v => v !== value),
        };
      });
    } else {
      setFormData(prev => ({...prev, [name]: value}));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Форма отправлена!");
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      {DUMMY_QUESTIONS.map((q, idx) => (
        <div
          key={q.name}
          className={styles.block}
        >
          <label className={styles.label}>
            <span className={styles.num}>
              {idx + QUESTION_NUM_1}
              .
            </span>
            {q.label}
          </label>

          {q.type === "text" && (
            <input
              className={styles.textInput}
              type="text"
              name={q.name}
              placeholder={q.placeholder}
              value={(formData[q.name] as string) || ""}
              onChange={handleChange}
            />
          )}

          {q.type === "radio" && (
            <div className={styles.options}>
              {q.options.map(opt => (
                <label
                  key={opt}
                  className={styles.option}
                >
                  <input
                    className={styles.radio}
                    type="radio"
                    name={q.name}
                    value={opt}
                    checked={(formData[q.name] as string) === opt}
                    onChange={handleChange}
                  />
                  <span className={styles.optionText}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          )}

          {q.type === "checkbox" && (
            <div className={styles.options}>
              {q.options.map(opt => (
                <label
                  key={opt}
                  className={styles.option}
                >
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    name={q.name}
                    value={opt}
                    checked={
                      Array.isArray(formData[q.name]) &&
                      (formData[q.name] as string[]).includes(opt)
                    }
                    onChange={handleChange}
                  />
                  <span className={styles.optionText}>
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        className={styles.submit}
      >
        Отправить
      </button>
    </form>
  );
}
