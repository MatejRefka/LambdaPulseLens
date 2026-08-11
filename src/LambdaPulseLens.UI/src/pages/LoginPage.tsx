import { AuthInput } from "../features/auth/components/AuthInput";
import { AuthButton } from "../features/auth/components/AuthButton";
import { useLogin } from "../features/auth/hooks/useLogin";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/useTheme";
import { Sun, Moon } from "lucide-react";
import { AppVersionLabel } from "../components/shared/AppVersionLabel";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, errors, isSubmitting, submitError, onSubmit } = useLogin();
  const { theme, toggleTheme } = useTheme();
  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    void handleSubmit(onSubmit)(event);
  };

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
        <div className="flex flex-col md:flex-row w-full max-w-3xl min-h-120 rounded-2xl overflow-hidden shadow-2xl dark:shadow-lg">
          {/*left card: login form*/}
          <div className="flex-1 py-10 md:py-14 flex flex-col items-center justify-center bg-surface-10">
            <h2 className="text-center font-extrabold text-3xl md:text-4xl">Sign in</h2>
            <form noValidate onSubmit={onFormSubmit} className="mt-7 flex w-80 flex-col">
              <div className="flex flex-col gap-4">
                <AuthInput type="email" placeholder="email" {...register("email")} error={errors.email?.message} />
                <AuthInput
                  type="password"
                  placeholder="password"
                  {...register("password")}
                  error={errors.password?.message}
                />
              </div>
              {submitError && <p className="mt-4 text-danger-10 text-sm text-center">{submitError}</p>}
              <AuthButton type="submit" variant="primary" className="mt-10 mx-auto w-40" disabled={isSubmitting}>
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
              <AuthButton type="button" variant="secondary" className="w-40" onClick={() => void navigate("/register")}>
                Sign up
              </AuthButton>
            </div>
          </div>
        </div>
      </div>

      <AppVersionLabel />
    </div>
  );
};
