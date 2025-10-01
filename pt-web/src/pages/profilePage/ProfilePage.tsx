/* eslint-disable max-len */
import React, {useMemo, useState} from "react";
import {CalendarClock, Crown, PhoneCall} from "lucide-react";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {PATHS} from "src/routes/routes";
import styles from "src/pages/profilePage/ProfilePage.module.scss";

const MS_IN_DAY = 86_400_000;
const RECOMMENDATION_MAX_LEN = 255;
const ELLIPSIS = "…";
const ELLIPSIS_LEN = ELLIPSIS.length;
const DEMO_PLAN_KEY = "demo_plan";

const DAYS_AGO_2 = 2;
const DAYS_AGO_5 = 5;
const DAYS_AGO_9 = 9;
const DAYS_AGO_14 = 14;
const DAYS_AGO_18 = 18;
const DAYS_AGO_23 = 23;

type SubscriptionPlan = "free" | "premium";

type User = {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  city?: string;
};

type TestResult = {
  id: string;
  conditionId: string;
  conditionName: string;
  dateISO: string;
  status: string;
  recommendation: string;
};

function useProfileData(): { user: User; tests: TestResult[] } {
  const demoUser: User = {
    id: "1",
    name: "Иван Петров",
    email: "ivan@example.com",
    plan: (localStorage.getItem(DEMO_PLAN_KEY) as SubscriptionPlan) || "free",
    city: "Dresden, Germany",
  };

  const now = Date.now();
  const dateTest = (daysAgo: number) => new Date(now - (daysAgo * MS_IN_DAY)).toISOString();

  const tests: TestResult[] = [
    {id: "t10", conditionId: "panic", conditionName: "Паническая атака", dateISO: dateTest(DAYS_AGO_2), status: "Умеренная", recommendation: "Практикуйте заземление, отслеживайте триггеры, дыхание 4–6 в течение 5 минут."},
    {id: "t9", conditionId: "depression", conditionName: "Депрессия", dateISO: dateTest(DAYS_AGO_5), status: "Низкая", recommendation: "Сон 7–8 часов, лёгкая активность 20–30 минут, поддерживайте социальные контакты."},
    {id: "t8", conditionId: "burnout", conditionName: "Выгорание", dateISO: dateTest(DAYS_AGO_9), status: "Высокая", recommendation: "Перераспределите нагрузку, запланируйте окна восстановления, микропаузу каждый час."},
    {id: "t7", conditionId: "panic", conditionName: "Паническая атака", dateISO: dateTest(DAYS_AGO_14), status: "Низкая", recommendation: "Продолжайте дыхательные техники, добавьте короткие прогулки ежедневно."},
    {id: "t6", conditionId: "depression", conditionName: "Депрессия", dateISO: dateTest(DAYS_AGO_18), status: "Умеренная", recommendation: "Структурируйте день, дневник активности, мягкие цели на неделю."},
    {id: "t5", conditionId: "panic", conditionName: "Паническая атака", dateISO: dateTest(DAYS_AGO_23), status: "Высокая", recommendation: "Исключите избыток кофеина, дыхание 4–6, план снижения избегания."},
  ];

  return {user: demoUser, tests};
}

export function ProfilePage() {
  const {user, tests} = useProfileData();
  const [openConditionId, setOpenConditionId] = useState<string | null>(null);
  const [upgradeHint, setUpgradeHint] = useState(false);

  const isPremium = user.plan === "premium";
  const hotlineNumber = import.meta.env.VITE_HOTLINE_PHONE;

  const sorted = useMemo(
    () => [...tests].sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()),
    [tests],
  );

  const groupedByCondition = useMemo(() => {
    const conditionMap = new Map<string, TestResult[]>();
    for (const t of sorted) {
      const arr = conditionMap.get(t.conditionId) || [];
      arr.push(t);
      conditionMap.set(t.conditionId, arr);
    }

    return conditionMap;
  }, [sorted]);

  const firstIndexByCondition = useMemo(() => {
    const map = new Map<string, number>();
    sorted.forEach((row, idx) => {
      if (!map.has(row.conditionId)) {
        map.set(row.conditionId, idx);
      }
    });

    return map;
  }, [sorted]);

  const openHistory = (conditionId: string) => {
    setOpenConditionId(prev => (prev === conditionId ? null : conditionId));
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, Math.max(0, max - ELLIPSIS_LEN))}${ELLIPSIS}` : text;

  const toDate = (iso: string) => new Date(iso).toLocaleDateString();

  return (
    <div className={styles.page}>
      <PageHeader
        title="Профиль"
        subtitle="Ваши данные, подписка и результаты тестов."
      />

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Данные пользователя
          </h2>
          <div className={styles.userRow}>
            <div className={styles.userInfo}>
              <div className={styles.userName}>
                {user.name}
              </div>
              <div className={styles.userEmail}>
                {user.email}
              </div>
              <div className={styles.userInfo}>
                {user.city
                  ? <div>
                    Город:
                    {user.city}
                  </div>
                  : null}
                <div>
                  ID:
                  {user.id}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            Подписка
          </h2>

          <div className={styles.planHeader}>
            <div className={styles.planStatus}>
              {isPremium
                ? (
                  <span className={`${styles.planBadge} ${styles.planPremium}`}>
                    <Crown
                      className={styles.planIcon}
                      aria-hidden="true"
                    />
                    Премиум
                  </span>
                )
                : (
                  <span className={styles.planDefault}>
                    Бесплатная
                  </span>
                )}
            </div>

            <div className={styles.planPrimaryActions}>
              <Button to={PATHS.SOS?.CONSULTATION ?? "/support/consultation"}>
                Назначить консультацию
              </Button>
              {!isPremium && (
                <button
                  type="button"
                  className={styles.upgradeBtn}
                  onClick={() => setUpgradeHint(true)}
                >
                  <Crown className={styles.inlineIcon} />
                  Перейти на Премиум
                </button>
              )}
            </div>
          </div>

          <div className={styles.planBody}>
            <p className={styles.planDesc}>
              Премиум даёт приоритетную запись и доступ к экстренному вызову специалиста.
            </p>
            <div className={styles.planSecondaryActions}>
              <button
                type="button"
                className={`${styles.ghostBtn} ${!isPremium ? styles.btnDisabled : ""}`}
                aria-disabled={!isPremium}
              >
                Приоритетная запись
              </button>
              {isPremium
                ? (
                  <a
                    href={hotlineNumber ? `tel:${hotlineNumber}` : undefined}
                    className={styles.ghostBtn}
                  >
                    <PhoneCall className={styles.inlineIcon} />
                    Экстренный вызов
                  </a>
                )
                : (
                  <button
                    type="button"
                    className={`${styles.ghostBtn} ${styles.btnDisabled}`}
                    aria-disabled
                  >
                    <PhoneCall className={styles.inlineIcon} />
                    Экстренный вызов
                  </button>
                )}
            </div>
            {!isPremium && upgradeHint && <div className={styles.hint}>
              Оформление Premium скоро будет доступно.
            </div>}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>
            Результаты тестов
          </h2>
          <div className={styles.cardSub}>
            Сначала показывается последний проход
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table
            className={styles.table}
            aria-label="История прохождения тестов"
          >
            <thead>
              <tr>
                <th className={styles.colDate}>
                  <CalendarClock
                    className={styles.thIcon}
                    aria-hidden="true"
                  />
                  Дата
                </th>
                <th>
                  Название
                </th>
                <th>
                  Статус
                </th>
                <th className={styles.colRec}>
                  Рекомендация
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((row, idx) => {
                const isFirstForCondition = firstIndexByCondition.get(row.conditionId) === idx;
                const isOpenHere = openConditionId === row.conditionId && isFirstForCondition;
                const history = groupedByCondition.get(row.conditionId) || [];

                return (
                  <React.Fragment key={row.id}>
                    <tr>
                      <td
                        className={styles.cellDate}
                        data-label="Дата"
                      >
                        {toDate(row.dateISO)}
                      </td>
                      <td data-label="Название">
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => openHistory(row.conditionId)}
                          aria-expanded={openConditionId === row.conditionId}
                          aria-controls={`history-${row.conditionId}`}
                        >
                          {row.conditionName}
                        </button>
                      </td>
                      <td data-label="Статус">
                        <span className={styles.status}>
                          {row.status}
                        </span>
                      </td>
                      <td
                        className={styles.cellRec}
                        data-label="Рекомендация"
                        title={row.recommendation}
                      >
                        {truncate(row.recommendation, RECOMMENDATION_MAX_LEN)}
                      </td>
                    </tr>

                    {isOpenHere && (
                      <tr
                        id={`history-${row.conditionId}`}
                        className={styles.expandRow}
                      >
                        <td colSpan={4}>
                          <div className={styles.expandWrap}>
                            <div className={styles.expandTitle}>
                              История:
                              {row.conditionName}
                            </div>

                            <table
                              className={styles.innerTable}
                              aria-label={`История: ${row.conditionName}`}
                            >
                              <thead>
                                <tr>
                                  <th className={styles.colDateSm}>
                                    Дата
                                  </th>
                                  <th>
                                    Название
                                  </th>
                                  <th>
                                    Статус
                                  </th>
                                  <th>
                                    Рекомендация
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {history.map(testResult => (
                                  <tr key={testResult.id}>
                                    <td
                                      className={styles.cellDate}
                                      data-label="Дата"
                                    >
                                      {toDate(testResult.dateISO)}
                                    </td>
                                    <td
                                      className={styles.cellTitle}
                                      data-label="Название"
                                    >
                                      {testResult.conditionName}
                                    </td>
                                    <td data-label="Статус">
                                      <span className={styles.status}>
                                        {testResult.status}
                                      </span>
                                    </td>
                                    <td
                                      className={styles.cellRec}
                                      data-label="Рекомендация"
                                    >
                                      {truncate(testResult.recommendation, RECOMMENDATION_MAX_LEN)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
