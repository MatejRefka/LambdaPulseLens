import React from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useRegister } from "../hooks/useRegister";
import googleIcon from "../assets/icons/google.png";
import appleIcon from "../assets/icons/apple.png";
import githubIcon from "../assets/icons/github.png";

interface RegisterPageProps {
  onRedirectToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRedirectToLogin }) => {
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, handleRegisterSubmit } =
    useRegister();

  return (
    <div className="landing-page-layout">
      <div className="card-wrapper rounded-2xl overflow-hidden shadow-2xl">
        {/*left card: welcome back message + sign In */}
        <div className="form-card bg-strawberry">
          <h2 className="text-center text-white">Welcome Back</h2>
          <p className="w-80 text-white mt-4 text-center">
            Already have an account? Sign in to monitor your Lambda Pulse pipeline.
          </p>
          <div className="mt-6 flex justify-center">
            <Button type="button" variant="secondary" className="w-40" onClick={onRedirectToLogin}>
              Sign in
            </Button>
          </div>
        </div>

        {/*right card: register form*/}
        <div className="form-card bg-white">
          <h2 className="text-center">Sign up</h2>
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
          <p className="text-center mb-2">or use your email</p>
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4 w-80">
            <Input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="mt-2 mx-auto w-40">
              Sign up
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
