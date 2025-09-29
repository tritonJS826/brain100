import {ChangeEvent} from "react";
import styles from "src/components/PageHeader/PageHeader.module.scss";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  searchValue: string;
  searchPlaceholder: string;
  ariaSearchLabel: string;
  onSearchChange: (value: string) => void;
};

export function PageHeader({
  title,
  subtitle,
  searchValue,
  searchPlaceholder,
  ariaSearchLabel,
  onSearchChange,
}: PageHeaderProps) {
  return (
    <header className={styles.head}>
      <h1
        id="diag-title"
        className={styles.title}
      >
        {title}
      </h1>
      {subtitle && <p className={styles.subtitle}>
        {subtitle}
      </p>}
      <div className={styles.toolbar}>
        <input
          type="search"
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          className={styles.search}
          aria-label={ariaSearchLabel}
        />
      </div>
    </header>
  );
}
