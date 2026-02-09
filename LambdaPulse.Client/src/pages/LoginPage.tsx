import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useLogin } from "../hooks/useLogin";
import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";
import githubIcon from "../assets/icons/github.png";

interface LoginPageProps {
  onRedirectToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRedirectToRegister }) => {
  const { email, setEmail, password, setPassword, handleLoginSubmit } = useLogin();

  return (
    <div className="landing-page-layout">
      <div className="card-wrapper rounded-2xl overflow-hidden shadow-2xl">
        {/*left card: login form*/}
        <div className="form-card">
          <h2 className="flex justify-center">Sign in</h2>
          <div className="flex justify-center gap-3 m-4">
            <Button variant="icon">
              <img src={googleIcon} className="w-5.5 h-5.5" alt="Google" />
            </Button>
            <Button variant="icon">
              <img src={appleIcon} className="w-6 h-6" alt="Apple" />
            </Button>
            <Button variant="icon">
              <img src={githubIcon} className="w-6.5 h-6.5 mt-0.5" alt="GitHub" />
            </Button>
          </div>
          <p className="flex justify-center mb-2">or use your account</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-2">
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mx-auto text-right pr-2">
              <a className="text-sm text-right">Forgot password?</a>
            </div>
            <div className="mt-6 flex justify-center">
              <Button type="submit" variant="primary">
                Sign in
              </Button>
            </div>
          </form>
        </div>

        {/*right card: welcome message + sign up*/}
        <div className="form-card bg-strawberry">
          <h2 className="flex justify-center text-white">Get started</h2>
          <p className="w-80 text-white mt-4 text-center">
            Create your account to start exploring the Lambda Pulse web server.
          </p>
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="secondary">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
