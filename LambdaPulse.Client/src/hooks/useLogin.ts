import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormInputs } from "../schemas/authSchemas";

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormInputs>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = (data: LoginFormInputs) => {
    console.log("User login", data);
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit };
};
