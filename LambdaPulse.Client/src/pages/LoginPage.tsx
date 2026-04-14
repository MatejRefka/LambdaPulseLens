import { Input } from "../components/shared/Input";
import { Button } from "../components/shared/Button";
import { useLogin } from "../features/auth/hooks/useLogin";
import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";
import githubIcon from "../assets/icons/github.png";

interface LoginPageProps {
  onRedirectToRegister: () => void;
}

export const LoginPage = ({ onRedirectToRegister }: LoginPageProps) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();

  return (
    <div className="auth-page-layout">
      <div className="auth-card-wrapper">
        {/*left card: login form*/}
        <div className="auth-form-card">
          <h2 className="text-center font-extrabold text-4xl">Sign in</h2>
          <div className="flex justify-center gap-3 m-4">
            <Button variant="icon" className="w-12 h-12">
              <img src={googleIcon} className="w-5.5 h-5.5" alt="Google" />
            </Button>
            <Button variant="icon" className="w-12 h-12">
              <img src={appleIcon} className="w-6 h-6" alt="Apple" />
            </Button>
            <Button variant="icon" className="w-12 h-12">
              <img src={githubIcon} className="w-6.5 h-6.5 mt-0.5" alt="GitHub" />
            </Button>
          </div>
          <p className="text-center mb-2">or use your account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
            <Input type="email" placeholder="email" {...register("email")} error={errors.email?.message} />
            <Input type="password" placeholder="password" {...register("password")} error={errors.password?.message} />
            <button type="button" className="text-sm text-right pr-2 -mt-2 underline">
              Forgot password?
            </button>
            <Button type="submit" variant="primary" className="mt-6 mx-auto w-40" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        {/*right card: welcome message + sign up*/}
        <div className="auth-form-card bg-strawberry">
          <h2 className="text-center text-white font-extrabold text-4xl">Get started</h2>
          <p className="w-80 text-white mt-4 text-center">
            Create your account to start exploring the Lambda Pulse web server.
          </p>
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="secondary" className="w-40" onClick={onRedirectToRegister}>
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
