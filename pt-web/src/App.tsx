import {BrowserRouter, Route, Routes} from "react-router-dom";
import {HomePage} from "src/pages/Homepage/Homepage";
import {PATHS} from "src/routes/routes";

export function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path={PATHS.HOME}
          element={<HomePage />}
        />
        <Route
          path={PATHS.ABOUT_PROJECT}
          element={<div>
            О проекте
          </div>}
        />
        <Route
          path={PATHS.MENTAL_HEALTH.ROOT}
          element={<div>
            Психическое здоровье
          </div>}
        />
        <Route
          path={PATHS.MENTAL_HEALTH.DETAIL}
          element={<div>
            Страница состояния
          </div>}
        />
        <Route
          path={PATHS.DIAGNOSTICS.ROOT}
          element={<div>
            Диагностика
          </div>}
        />
        <Route
          path={PATHS.DIAGNOSTICS.TEST}
          element={<div>
            Страница теста
          </div>}
        />
        <Route
          path={PATHS.DIAGNOSTICS.RESULTS}
          element={<div>
            Результаты теста
          </div>}
        />
        <Route
          path={PATHS.BIOHACKING.ROOT}
          element={<div>
            Биохакинг
          </div>}
        />
        <Route
          path={PATHS.BIOHACKING.ARTICLE}
          element={<div>
            Статья по биохакингу
          </div>}
        />
        <Route
          path={PATHS.SPECIALIST}
          element={<div>
            О специалисте
          </div>}
        />
        <Route
          path={PATHS.CONTACTS}
          element={<div>
            Контакты
          </div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
