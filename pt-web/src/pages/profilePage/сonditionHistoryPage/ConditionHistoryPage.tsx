
import React, {useMemo} from "react";
import {useParams} from "react-router-dom";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import styles from "src/pages/profilePage/сonditionHistoryPage/ConditionHistoryPage.module.scss";

const MS_IN_DAY = 86_400_000;

const DAYS_AGO_2 = 2;
const DAYS_AGО_5 = 5;
const DAYS_AGО_9 = 9;
const DAYS_AGО_18 = 18;

type ConditionKey = "depression" | "panic";
type StatusKey = "low" | "moderate" | "high";

type TestResult = {
  id: string;
  conditionId: ConditionKey;
  dateISO: string;
  status: StatusKey;
};

type ProfileDictionary = {
  history: {
    titlePrefix: string;
    emptyTitle: string;
    emptySubtitle: string;
    date: string;
    name: string;
    status: string;
    recommendation: string;
  };
  conditions: Record<ConditionKey, string>;
  status: Record<StatusKey, string>;
  recommendations: Record<ConditionKey, Record<StatusKey, string>>;
};

// Демо-данные, позже заменишь на реальные из API
function useConditionTests(conditionId: ConditionKey | string): TestResult[] {
  const now = Date.now();
  const d = (daysAgo: number) => new Date(now - (daysAgo * MS_IN_DAY)).toISOString();

  const all: TestResult[] = [
    {id: "t1", conditionId: "depression", dateISO: d(DAYS_AGO_2), status: "moderate"},
    {id: "t2", conditionId: "depression", dateISO: d(DAYS_AGО_5), status: "high"},
    {id: "t3", conditionId: "panic", dateISO: d(DAYS_AGО_9), status: "low"},
    {id: "t4", conditionId: "panic", dateISO: d(DAYS_AGО_18), status: "high"},
  ];

  return all.filter(t => t.conditionId === conditionId);
}

export function ConditionHistoryPage() {
  const {id} = useParams<{ id: ConditionKey }>();
  const dict = useDictionary(DictionaryKey.PROFILE) as ProfileDictionary | null;

  const tests = useConditionTests(id || "");
  const sorted = useMemo(
    () => [...tests].sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
    ),
    [tests],
  );

  const toDate = (iso: string) => new Date(iso).toLocaleDateString();

  if (!dict) {
    return (
      <div className={styles.page}>
        Loading...
      </div>
    );
  }

  if (!id || sorted.length === 0) {
    return (
      <div className={styles.page}>
        <PageHeader
          title={dict.history.emptyTitle}
          subtitle={dict.history.emptySubtitle}
        />
      </div>
    );
  }

  const conditionTitle = dict.conditions[id];

  return (
    <div className={styles.page}>
      <PageHeader
        title={`${dict.history.titlePrefix} ${conditionTitle}`}
        subtitle={dict.history.emptySubtitle}
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                {dict.history.date}
              </th>
              <th>
                {dict.history.name}
              </th>
              <th>
                {dict.history.status}
              </th>
              <th>
                {dict.history.recommendation}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.id}>
                <td data-label={dict.history.date}>
                  {toDate(row.dateISO)}
                </td>
                <td data-label={dict.history.name}>
                  {dict.conditions[row.conditionId]}
                </td>
                <td data-label={dict.history.status}>
                  {dict.status[row.status]}
                </td>
                <td data-label={dict.history.recommendation}>
                  {dict.recommendations[row.conditionId][row.status]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
