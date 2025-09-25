import {Route, Routes} from "react-router-dom";
import {Footer} from "src/components/Footer/Footer";
import {Header} from "src/components/Header/Header";
import {ScrollToTop} from "src/components/ScrollToTop/ScrollToTop";
import {AboutPage} from "src/pages/aboutUsPage/AboutUsPage";
import {ArticleDetailPage} from "src/pages/articlesListPage/articles/ArticleDetailPage";
import {ArticlesListPage} from "src/pages/articlesListPage/ArticlesListPage";
import {HomePage} from "src/pages/homePage/Homepage";
import {Test} from "src/pages/testsListPage/tests/Test";
import {TestsList} from "src/pages/testsListPage/TestsListPage";
import {PATHS} from "src/routes/routes";

export function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route
          path={PATHS.HOME}
          element={<HomePage />}
        />
        <Route
          path={PATHS.ABOUT}
          element={<AboutPage />}
        />

        <Route
          path={PATHS.MENTAL_HEALTH.LIST}
          element={<ArticlesListPage />}
        />
        <Route
          path={PATHS.MENTAL_HEALTH.DETAIL}
          element={<ArticleDetailPage />}
        />

        <Route
          path={PATHS.DIAGNOSTICS.LIST}
          element={<TestsList />}
        />
        <Route
          path={PATHS.DIAGNOSTICS.DETAIL}
          element={<Test />}
        />

        <Route
          path={PATHS.BIOHACKING.LIST}
          element={<div>
            Биохакинг
          </div>}
        />
        <Route
          path={PATHS.BIOHACKING.DETAIL}
          element={<div>
            Статья по биохакингу
          </div>}
        />

        <Route
          path={PATHS.SOS.LIST}
          element={<div>
            Поддержка
          </div>}
        />
        <Route
          path={PATHS.SOS.DETAIL}
          element={<div>
            Поддержка — состояние
          </div>}
        />

        <Route
          path={PATHS.SPECIALISTS.LIST}
          element={<div>
            Специалисты
          </div>}
        />
        <Route
          path={PATHS.SPECIALISTS.DETAIL}
          element={<div>
            Профиль специалиста
          </div>}
        />

        <Route
          path={PATHS.CONTACTS}
          element={<div>
            Контакты
          </div>}
        />
      </Routes>
      <Footer />
    </>
  );
}
