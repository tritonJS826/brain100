import {Route, Routes} from "react-router-dom";
import {Footer} from "src/components/Footer/Footer";
import {Header} from "src/components/Header/Header";
import {HomePage} from "src/pages/homePage/Homepage";
import {Depression} from "src/pages/tests/Depression";
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
const DiagnosticsList = () => (<div>
  Каталог тестов
</div>);
const DiagnosticsDetail = () => (<div>
  Тест
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
          element={<DiagnosticsDetail />}
        />
        <Route
          path={PATHS.DIAGNOSTICS.DEPRESSION_TEST}
          element={<Depression />}
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
          path={PATHS.SUPPORT.LIST}
          element={<SupportList />}
        />
        <Route
          path={PATHS.SUPPORT.DETAIL}
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
