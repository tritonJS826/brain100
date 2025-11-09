import {useNavigate, useParams} from "react-router-dom";
import {Button} from "src/components/Button/Button";
import {PageHeader} from "src/components/PageHeader/PageHeader";
import {DictionaryKey} from "src/dictionary/dictionaryLoader";
import {useDictionary} from "src/dictionary/useDictionary";
import {buildPath} from "src/routes/routes";
import styles from "src/pages/testsListPage/tests/TestStartPage.module.scss";

type TestStartData = {
  title: string;
  subtitle: string;
  description: string;
  button: string;
};

export function TestStartPage() {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();

  const FIRST_QUESTION_NUMBER = 1;

  const dictionary = useDictionary(DictionaryKey.TESTS) as {
    startPageData: Record<string, TestStartData>;
  } | null;

  if (!id || !dictionary) {
    return null;
  }

  const testContent = dictionary.startPageData[id] ?? dictionary.startPageData.default;

  const handleStart = () => {
    if (id === "main") {
      navigate(buildPath.testQuestion(id, FIRST_QUESTION_NUMBER));
    } else {
      alert("This test is not yet implemented.");
    }
  };

  return (
    <section className={styles.wrap}>
      <PageHeader
        title={testContent.title}
        subtitle={testContent.subtitle}
      />

      <div className={styles.startBlock}>
        <p className={styles.description}>
          {testContent.description}
        </p>
        <Button
          onClick={handleStart}
          className={styles.startButton}
        >
          {testContent.button}
        </Button>
      </div>
    </section>
  );
}
