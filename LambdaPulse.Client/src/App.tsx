import { ThemeProvider } from "./contexts/ThemeProvider";
import { DashboardPage } from "./pages/DashboardPage";
// import { LoginPage } from "./pages/LoginPage";
// import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <ThemeProvider>
      {/* <RegisterPage onRedirectToLogin={() => console.log("Redirected to Login page!")} /> */}

      {/* <LoginPage onRedirectToRegister={() => console.log("Redirected to Register page!")} /> */}

      <DashboardPage />
    </ThemeProvider>
  );
}

export default App;
