import styles from "src/components/ButtonHello/ButtonHello.module.scss";

export function HelloButton() {

  const handleClick = () => alert("Hello!");

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Say Hello to Photo tours
      </h1>
      <p className={styles.subtitle}>
        Please, click the button
      </p>
      <button
        className={styles.buttonHello}
        onClick={handleClick}
      >
        Say Hello!
      </button>
    </div>
  );
}

