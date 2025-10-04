import {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import {Footer} from "src/components/Footer/Footer";
import {Header} from "src/components/Header/Header";
import {ScrollToTop} from "src/components/ScrollToTop/ScrollToTop";
import {AboutPage} from "src/pages/aboutUsPage/AboutUsPage";
import {ArticleDetailPage} from "src/pages/articlesListPage/articles/ArticleDetailPage";
import {ArticlesListPage} from "src/pages/articlesListPage/ArticlesListPage";
import {AuthPage} from "src/pages/authPage/AuthPage";
import {BiohackingDetailPage} from "src/pages/biohackingListPage/articles/BiohackingDetailPage";
import {BiohackingListPage} from "src/pages/biohackingListPage/BiohackingListPage";
import {HomePage} from "src/pages/homePage/Homepage";
import {ProfilePage} from "src/pages/profilePage/ProfilePage";
import {ConditionHistoryPage} from "src/pages/profilePage/сonditionHistoryPage/ConditionHistoryPage";
import {SupportConsultationPage} from "src/pages/supportPage/SupportConsultationPage/SupportConsultationPage";
import {SupportPage} from "src/pages/supportPage/SupportPage";
import {Test} from "src/pages/testsListPage/tests/Test";
import {TestsList} from "src/pages/testsListPage/TestsListPage";
import {PATHS} from "src/routes/routes";
import {DevApi} from "src/services/health";
import "src/styles/_globals.scss";

export function App() {
  // TODO: remove this temporal check server integration
  useEffect(() => {
    DevApi.checkHealth();
  }, [ ]);

  return (
    <div className="page">
      <ScrollToTop />
      <Header />
      <main className="main">
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
            path={PATHS.TESTS.LIST}
            element={<TestsList />}
          />
          <Route
            path={PATHS.TESTS.DETAIL}
            element={<Test />}
          />

          <Route
            path={PATHS.BIOHACKING.LIST}
            element={<BiohackingListPage />}
          />
          <Route
            path={PATHS.BIOHACKING.DETAIL}
            element={<BiohackingDetailPage />}
          />
          <Route
            path={PATHS.SOS.LIST}
            element={<SupportPage />}
          />
          <Route
            path={PATHS.SOS.CONSULTATION}
            element={<SupportConsultationPage />}
          />
          <Route
            path={PATHS.AUTH.PAGE}
            element={<AuthPage />}
          />
          <Route
            path={PATHS.PROFILE.PAGE}
            element={<ProfilePage />}
          />
          <Route
            path={PATHS.PROFILE.CONDITION}
            element={<ConditionHistoryPage />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
