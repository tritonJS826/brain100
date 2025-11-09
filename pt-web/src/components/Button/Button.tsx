import {Link} from "react-router-dom";
import styles from "src/components/Button/Button.module.scss";

type ButtonProps = {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
  className?: string;
};

export function Button({to, onClick, children, type = "button", className = ""}: ButtonProps) {
  const combinedClassName = `${styles.ctaButton} ${className}`.trim();

  if (to) {
    return (
      <Link
        to={to}
        className={combinedClassName}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={combinedClassName}
      type={type}
    >
      {children}
    </button>
  );
}
