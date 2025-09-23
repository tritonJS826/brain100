import {Route, Routes} from "react-router-dom";
import {Footer} from "src/components/Footer/Footer";
import {Header} from "src/components/Header/Header";
import {DiagnosticsList} from "src/pages/diagnosticsListPage/DiagnosticsListPage";
import {HomePage} from "src/pages/homePage/Homepage";
import {Test} from "src/pages/tests/Test";
import {PATHS} from "src/routes/routes";

const About = () => (<div>
  О проекте
</div>);
const MentalList = () => (<div>
  Каталог состояний
</div>);
const MentalDetail = () => (<div>
  Статья о состоянии
</div>);
const BioList = () => (<div>
  Биохакинг
</div>);
const BioDetail = () => (<div>
  Статья по биохакингу
</div>);
const SupportList = () => (<div>
  Поддержка
</div>);
const SupportDetail = () => (<div>
  Поддержка — состояние
</div>);
const SpecialistsList = () => (<div>
  Специалисты
</div>);
const Specialist = () => (<div>
  Профиль специалиста
</div>);
const Contacts = () => (<div>
  Контакты
</div>);

export function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path={PATHS.HOME}
          element={<HomePage />}
        />
        <Route
          path={PATHS.ABOUT}
          element={<About />}
        />

        <Route
          path={PATHS.MENTAL_HEALTH.LIST}
          element={<MentalList />}
        />
        <Route
          path={PATHS.MENTAL_HEALTH.DETAIL}
          element={<MentalDetail />}
        />

        <Route
          path={PATHS.DIAGNOSTICS.LIST}
          element={<DiagnosticsList />}
        />
        <Route
          path={PATHS.DIAGNOSTICS.DETAIL}
          element={<Test />}
        />
        <Route
          path={PATHS.BIOHACKING.LIST}
          element={<BioList />}
        />
        <Route
          path={PATHS.BIOHACKING.DETAIL}
          element={<BioDetail />}
        />

        <Route
          path={PATHS.SOS.LIST}
          element={<SupportList />}
        />
        <Route
          path={PATHS.SOS.DETAIL}
          element={<SupportDetail />}
        />

        <Route
          path={PATHS.SPECIALISTS.LIST}
          element={<SpecialistsList />}
        />
        <Route
          path={PATHS.SPECIALISTS.DETAIL}
          element={<Specialist />}
        />

        <Route
          path={PATHS.CONTACTS}
          element={<Contacts />}
        />
      </Routes>
      <Footer />
    </>
  );
}
