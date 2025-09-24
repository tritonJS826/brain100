import {useState} from "react";
import {Link} from "react-router-dom";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/diagnosticsListPage/DiagnosticsListPage.module.scss";

const mockTests = [
  {id: "1", name: "Тест на наличие депрессии"},
  {id: "2", name: "Тест о настроении"},
  {id: "3", name: "Тест на уровень тревожности"},
  {id: "4", name: "Стресс-профиль"},
];

export function DiagnosticsList() {
  const [query, setQuery] = useState("");
  const tests = mockTests; // Нет смысла хранить в state/эффектах

  const q = query.trim().toLowerCase();
  const filtered = q ? tests.filter(t => t.name.toLowerCase().includes(q)) : tests;

  return (
    <section
      className={styles.wrap}
      aria-labelledby="diag-title"
    >
      <header className={styles.head}>
        <h1
          id="diag-title"
          className={styles.title}
        >
          Каталог тестов
        </h1>
        <p className={styles.subtitle}>
          Подборка валидированных опросников для самопроверки. Результаты не являются диагнозом.
        </p>

        <div className={styles.toolbar}>
          <input
            type="search"
            value={query}
            placeholder="Поиск теста…"
            onChange={(e) => setQuery(e.target.value)}
            className={styles.search}
            aria-label="Поиск по названию теста"
          />
          <span
            className={styles.count}
            aria-live="polite"
          >
            Найдено:
            {filtered.length}
          </span>
        </div>
      </header>

      <ul className={styles.grid}>
        {filtered.map(test => (
          <li
            key={test.id}
            className={styles.card}
          >
            <div className={styles.cardBody}>
              <h2 className={styles.cardTitle}>
                <Link
                  to={buildPath.diagnosticsDetail(test.id)}
                  className={styles.cardLink}
                >
                  {test.name}
                </Link>
              </h2>
              <p className={styles.cardText}>
                Короткое описание теста — что измеряет и когда полезен.
              </p>
            </div>
            <div className={styles.cardFoot}>
              <Link
                to={buildPath.diagnosticsDetail(test.id)}
                className={styles.cardBtn}
              >
                Пройти тест
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <p>
            Ничего не найдено. Попробуйте другой запрос.
          </p>
        </div>
      )}
    </section>
  );
}
