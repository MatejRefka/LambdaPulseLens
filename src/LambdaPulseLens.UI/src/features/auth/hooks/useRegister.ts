import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormInputs } from "../../../schemas/authSchemas";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/useAuth";

export const useRegister = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  const onSubmit = async (data: RegisterFormInputs) => {
    setSubmitError(null);

    try {
      await registerUser(data.email, data.password);
      await navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Registration failed.");
    }
  };

  return { register, handleSubmit, errors, isSubmitting, submitError, onSubmit };
};
