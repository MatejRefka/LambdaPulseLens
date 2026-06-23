import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <Routes>
      {/*root route. redirects to /dashboard*/}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/*public /register route*/}
      <Route path="/register" element={<RegisterPage />} />
      {/*public /login route*/}
      <Route path="/login" element={<LoginPage />} />

      {/*/dashboard within 'protected' route*/}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/*fallback, catches unknown routes and redirects to /dashboard*/}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
