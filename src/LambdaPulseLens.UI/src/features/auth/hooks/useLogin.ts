import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormInputs } from "../../../schemas/authSchemas";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";
import { useState } from "react";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  const onSubmit = async (data: LoginFormInputs) => {
    setSubmitError(null);

    try {
      await login(data.email, data.password);
      await navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Login failed.");
    }
  };

  return { register, handleSubmit, errors, isSubmitting, submitError, onSubmit };
};
