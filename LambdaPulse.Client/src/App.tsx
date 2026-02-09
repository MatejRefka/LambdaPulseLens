import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <LoginPage
      onRedirectToRegister={() => console.log("Redirected to Register page!")}
    ></LoginPage>
  );
}

export default App;
