import React, {useMemo, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {CalendarClock, PhoneCall} from "lucide-react";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {useAuth} from "src/contexts/AuthContext";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {localStorageWorker} from "src/globalServices/localStorageWorker";
import {buildPath, PATHS} from "src/routes/routes";
import styles from "src/pages/profilePage/ProfilePage.module.scss";

const storage = localStorageWorker as unknown as {
  getItemByKey: <U>(key: string) => U | null;
  setItemByKey: (key: string, value: unknown) => void;
  removeItemByKey: (key: string) => void;
};

const MS_IN_DAY = 86_400_000;
const DEMO_PLAN_KEY = "demo_plan";
const RECOMMENDATION_MAX_LEN = 255;
const ELLIPSIS = "…";
const ELLIPSIS_LEN = ELLIPSIS.length;

const DAYS_AGO_120 = 120;
const DAYS_AGO_2 = 2;
const DAYS_AGO_5 = 5;
const DAYS_AGO_9 = 9;
const DAYS_AGO_14 = 14;
const DAYS_AGO_18 = 18;
const DAYS_AGO_23 = 23;

type PlanKind = "free" | "support";
type ConditionKey = "panic" | "depression" | "burnout";
type StatusKey = "low" | "moderate" | "high";

type PlanDetails = {
  kind: PlanKind;
  planTitle: string;
  includedConsultations: number;
  usedConsultations: number;
  expiresISO?: string;
};

export type TestResult = {
  id: string;
  conditionId: ConditionKey;
  dateISO: string;
  status: StatusKey;
};

type ProfileDictionary = {
  page: { title: string; subtitle: string; logoutBtn: string };
  user: {
    title: string;
    city: string;
    phone: string;
    language: string;
    timezone: string;
    memberSince: string;
    preferredContact: string;
    preferredContactPhone: string;
    preferredContactEmail: string;
    id: string;
  };
  plan: {
    title: string;
    baseTitle: string;
    supportTitle: string;
    scheduleBtn: string;
    buyBtn: string;
    statsIncluded: string;
    statsDaysLeft: string;
    descActivePrefix: string;
    descActiveSuffix: string;
    descInactive: string;
    priorityBooking: string;
    emergencyCall: string;
    hint: string;
  };
  tests: {
    title: string;
    subtitle: string;
    date: string;
    name: string;
    status: string;
    recommendation: string;
  };
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

const getSafeStringFromStorage = (key: string): string | null => {
  try {
    const value = storage.getItemByKey<string>(key);

    if (typeof value === "string") {
      return value;
    }

    if (value === null) {
      return null;
    }

    return String(value);
  } catch {
    // Ignore
    return localStorage.getItem(key);
  }
};

function useDemoPlanAndTests(): { plan: PlanDetails; tests: TestResult[]; memberSinceISO: string } {
  const storedPlan = storage.getItemByKey<PlanKind>(DEMO_PLAN_KEY) ?? "free";

  const memberSinceISO = new Date(Date.now() - (DAYS_AGO_120 * MS_IN_DAY)).toISOString();
  const expiresISO = new Date(Date.now() + (DAYS_AGO_14 * MS_IN_DAY)).toISOString();

  const plan: PlanDetails =
    storedPlan === "free"
      ? {kind: "free", planTitle: "base", includedConsultations: 0, usedConsultations: 0}
      : {kind: "support", planTitle: "support", includedConsultations: 2, usedConsultations: 1, expiresISO};

  const now = Date.now();
  const dateTest = (daysAgo: number) => new Date(now - (daysAgo * MS_IN_DAY)).toISOString();

  const tests: TestResult[] = [
    {id: "t10", conditionId: "panic", dateISO: dateTest(DAYS_AGO_2), status: "moderate"},
    {id: "t9", conditionId: "depression", dateISO: dateTest(DAYS_AGO_5), status: "low"},
    {id: "t8", conditionId: "burnout", dateISO: dateTest(DAYS_AGO_9), status: "high"},
    {id: "t7", conditionId: "panic", dateISO: dateTest(DAYS_AGO_14), status: "low"},
    {id: "t6", conditionId: "depression", dateISO: dateTest(DAYS_AGO_18), status: "moderate"},
    {id: "t5", conditionId: "panic", dateISO: dateTest(DAYS_AGO_23), status: "high"},
  ];

  return {plan, tests, memberSinceISO};
}

export function ProfilePage() {
  const dict = useDictionary(DictionaryKey.PROFILE) as ProfileDictionary | null;
  const navigate = useNavigate();
  const {user: authUser, logout} = useAuth();

  const {plan, tests, memberSinceISO} = useDemoPlanAndTests();
  const [upgradeHint, setUpgradeHint] = useState(false);

  const storedName =
  getSafeStringFromStorage("userName") ??
  getSafeStringFromStorage("profileName") ??
  "—";

  type Preferred = "phone" | "email";

  const mergedUser: {
    id: string;
    name: string;
    email: string;
    city: string;
    phone: string;
    language: string;
    timezone: string;
    memberSinceISO: string;
    preferredContact: Preferred;
  } = {
    id: String(authUser?.id ?? "—"),
    name: storedName,
    email: authUser?.email ?? "—",
    city: "Dresden, Germany",
    phone: "+49 151 23456789",
    language: "Deutsch, English",
    timezone: "Europe/Berlin (UTC+1/UTC+2)",
    memberSinceISO,
    preferredContact: "email",
  };

  const hotlineNumber = import.meta.env.VITE_HOTLINE_PHONE as string | undefined;
  const isSupport = plan.kind === "support";

  const sorted = useMemo(
    () => [...tests].sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()),
    [tests],
  );

  const toDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "");
  const daysLeft = (iso?: string) =>
    iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / MS_IN_DAY)) : 0;
  const truncate = (text: string, max: number) =>
    text.length > max ? `${text.slice(0, Math.max(0, max - ELLIPSIS_LEN))}${ELLIPSIS}` : text;

  if (!dict) {
    return (
      <div className={styles.page}>
        Loading...
      </div>
    );
  }

  const planTitle = isSupport ? dict.plan.supportTitle : dict.plan.baseTitle;

  const onLogout = async () => {
    await logout();
    navigate(PATHS.HOME);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={dict.page.title}
        subtitle={dict.page.subtitle}
      />

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.userHeader}>
            <div>
              <div className={styles.userName}>
                {mergedUser.name}
              </div>
              <div className={styles.userEmail}>
                {mergedUser.email}
              </div>
            </div>

            <button
              type="button"
              className={styles.logoutBtn}
              onClick={onLogout}
            >
              {dict.page.logoutBtn}
            </button>
          </div>

          <h2 className={styles.cardTitle}>
            {dict.user.title}
          </h2>

          <div className={styles.userRow}>
            <div className={styles.userInfo}>
              <div>
                {dict.user.city}
                :
                {mergedUser.city}
              </div>
              <div>
                {dict.user.phone}
                :
                {mergedUser.phone}
              </div>
              <div>
                {dict.user.language}
                :
                {mergedUser.language}
              </div>
              <div>
                {dict.user.timezone}
                :
                {mergedUser.timezone}
              </div>
              <div>
                {dict.user.memberSince}
                :
                {toDate(mergedUser.memberSinceISO)}
              </div>
              <div>
                {dict.user.preferredContact}
                :
                {mergedUser.preferredContact === "phone"
                  ? ` ${dict.user.preferredContactPhone}`
                  : ` ${dict.user.preferredContactEmail}`}
              </div>
              <div>
                {dict.user.id}
                :
                {mergedUser.id}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>
              {dict.plan.title}
            </h2>
            <div className={styles.planStatusInline}>
              {isSupport
                ? (
                  <span className={`${styles.planBadge} ${styles.planSupport}`}>
                    {planTitle}
                  </span>
                )
                : (
                  <span className={styles.planDefault}>
                    {planTitle}
                  </span>
                )}
            </div>
          </div>

          <div className={styles.planHeader}>
            <div className={styles.planPrimaryActions}>
              <Button to={PATHS.SOS?.CONSULTATION ?? "/support/consultation"}>
                {dict.plan.scheduleBtn}
              </Button>
              {!isSupport && (
                <button
                  type="button"
                  className={styles.upgradeBtn}
                  onClick={() => setUpgradeHint(true)}
                >
                  {dict.plan.buyBtn}
                </button>
              )}
            </div>
          </div>

          <div className={styles.planBody}>
            <div className={styles.statActions}>
              <button
                type="button"
                className={styles.statBtn}
                aria-label={dict.plan.statsIncluded}
              >
                <span className={styles.statBtnValue}>
                  {plan.includedConsultations}
                </span>
                <span className={styles.statBtnLabel}>
                  {dict.plan.statsIncluded}
                </span>
              </button>

              <button
                type="button"
                className={styles.statBtn}
                aria-label={dict.plan.statsDaysLeft}
              >
                <span className={styles.statBtnValue}>
                  {isSupport ? daysLeft(plan.expiresISO) : "—"}
                </span>
                <span className={styles.statBtnLabel}>
                  {dict.plan.statsDaysLeft}
                </span>
              </button>
            </div>

            <p className={styles.planDesc}>
              {isSupport
                ? `${dict.plan.descActivePrefix} ${toDate(plan.expiresISO)}. ${dict.plan.descActiveSuffix}`
                : dict.plan.descInactive}
            </p>

            <div className={styles.planSecondaryActions}>
              <button
                type="button"
                className={`${styles.ghostBtn} ${!isSupport ? styles.btnDisabled : ""}`}
                aria-disabled={!isSupport}
              >
                {dict.plan.priorityBooking}
              </button>
              {isSupport
                ? (
                  <a
                    href={hotlineNumber ? `tel:${hotlineNumber}` : undefined}
                    className={styles.ghostBtn}
                  >
                    <PhoneCall className={styles.inlineIcon} />
                    {dict.plan.emergencyCall}
                  </a>
                )
                : (
                  <button
                    type="button"
                    className={`${styles.ghostBtn} ${styles.btnDisabled}`}
                    aria-disabled
                  >
                    <PhoneCall className={styles.inlineIcon} />
                    {dict.plan.emergencyCall}
                  </button>
                )}
            </div>

            {!isSupport && upgradeHint && <div className={styles.hint}>
              {dict.plan.hint}
            </div>}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2 className={styles.cardTitle}>
            {dict.tests.title}
          </h2>
          <div className={styles.cardSub}>
            {dict.tests.subtitle}
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table
            className={styles.table}
            aria-label={dict.tests.title}
          >
            <thead>
              <tr>
                <th className={styles.colDate}>
                  <CalendarClock
                    className={styles.thIcon}
                    aria-hidden="true"
                  />
                  {dict.tests.date}
                </th>
                <th>
                  {dict.tests.name}
                </th>
                <th>
                  {dict.tests.status}
                </th>
                <th className={styles.colRec}>
                  {dict.tests.recommendation}
                </th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((row) => {
                const rec = dict.recommendations[row.conditionId][row.status];

                return (
                  <tr key={row.id}>
                    <td
                      className={styles.cellDate}
                      data-label={dict.tests.date}
                    >
                      {toDate(row.dateISO)}
                    </td>
                    <td data-label={dict.tests.name}>
                      <NavLink
                        className={styles.linkBtn}
                        to={buildPath.profileCondition(row.conditionId)}
                      >
                        {dict.conditions[row.conditionId]}
                      </NavLink>
                    </td>
                    <td data-label={dict.tests.status}>
                      <span className={styles.status}>
                        {dict.status[row.status]}
                      </span>
                    </td>
                    <td
                      className={styles.cellRec}
                      data-label={dict.tests.recommendation}
                      title={rec}
                    >
                      {truncate(rec, RECOMMENDATION_MAX_LEN)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
