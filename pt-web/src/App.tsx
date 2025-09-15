import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Header} from "src/components/Header/Header";
import {HomePage} from "src/pages/Homepage/Homepage";
import {PATHS} from "src/routes/routes";

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route
          path={PATHS.HOME}
          element={<HomePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
