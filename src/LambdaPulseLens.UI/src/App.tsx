import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { DashboardPage } from "./pages/DashboardPage";
// import { LoginPage } from "./pages/LoginPage";
// import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        {/* <RegisterPage onRedirectToLogin={() => console.log("Redirected to Login page!")} /> */}

        {/* <LoginPage onRedirectToRegister={() => console.log("Redirected to Register page!")} /> */}

        <DashboardPage />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
