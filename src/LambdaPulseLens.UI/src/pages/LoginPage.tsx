import { AuthInput } from "../features/auth/components/AuthInput";
import { AuthButton } from "../features/auth/components/AuthButton";
import { useLogin } from "../features/auth/hooks/useLogin";
import googleIcon from "../assets/icons/google.png";
import googleIconDarkTheme from "../assets/icons/google-dt.png";
import appleIcon from "../assets/icons/apple.png";
import appleIconDarkTheme from "../assets/icons/apple-dt.png";
import githubIcon from "../assets/icons/github.png";
import githubIconDarkTheme from "../assets/icons/github-dt.png";
import { useTheme } from "../contexts/ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface LoginPageProps {
  onRedirectToRegister: () => void;
}

export const LoginPage = ({ onRedirectToRegister }: LoginPageProps) => {
  const { register, handleSubmit, errors, isSubmitting, onSubmit } = useLogin();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-surface-20 text-text-10">
      <div className="md:h-14 shrink-0 px-4 md:px-18 flex justify-end items-center">
        <button
          aria-label="Toggle Theme"
          className="p-2 rounded-md text-text-30 hover:text-text-10 hover:bg-surface-30 transition-all cursor-pointer"
          onClick={toggleTheme}
        >
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-4 md:p-0">
        <div className="flex flex-col md:flex-row w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl dark:shadow-lg">
          {/*left card: login form*/}
          <div className="flex-1 py-10 md:py-14 flex flex-col items-center justify-center bg-surface-10">
            <h2 className="text-center font-extrabold text-3xl md:text-4xl">Sign in</h2>
            <div className="flex justify-center gap-3 m-4">
              <AuthButton variant="icon" className="w-12 h-12 hover:bg-surface-30">
                {theme === "light" ? (
                  <img src={googleIcon} className="w-4.5 h-4.5" alt="Google" />
                ) : (
                  <img src={googleIconDarkTheme} className="w-4.5 h-4.5" alt="Google" />
                )}
              </AuthButton>
              <AuthButton variant="icon" className="w-12 h-12 hover:bg-surface-30">
                {theme === "light" ? (
                  <img src={appleIcon} className="w-5 h-5" alt="Apple" />
                ) : (
                  <img src={appleIconDarkTheme} className="w-5 h-5" alt="Apple" />
                )}
              </AuthButton>
              <AuthButton variant="icon" className="w-12 h-12 hover:bg-surface-30">
                {theme === "light" ? (
                  <img src={githubIcon} className="w-5.5 h-5.5 mt-0.5" alt="GitHub" />
                ) : (
                  <img src={githubIconDarkTheme} className="w-5.5 h-5.5 mt-0.5" alt="GitHub" />
                )}
              </AuthButton>
            </div>
            <p className="text-center text-text-20 mb-2">or use your account</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-80">
              <AuthInput type="email" placeholder="email" {...register("email")} error={errors.email?.message} />
              <AuthInput
                type="password"
                placeholder="password"
                {...register("password")}
                error={errors.password?.message}
              />
              <button type="button" className="text-sm text-right pr-2 -mt-2 underline">
                Forgot password?
              </button>
              <AuthButton type="submit" variant="primary" className="mt-6 mx-auto w-40" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </AuthButton>
            </form>
          </div>

          {/*right card: welcome message + sign up*/}
          <div className="flex-1 py-10 md:py-14 flex flex-col items-center justify-center bg-brand-20">
            <h2 className="text-center text-white font-extrabold text-3xl md:text-4xl">Get started</h2>
            <p className="w-64 md:w-80 text-white mt-4 text-center">
              Create your account to start exploring the Lambda Pulse web server.
            </p>
            <div className="mt-8 flex justify-center">
              <AuthButton type="button" variant="secondary" className="w-40" onClick={onRedirectToRegister}>
                Sign up
              </AuthButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
