import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormInputs } from "../schemas/authSchemas";

export const useRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur"
  });

  const onSubmit = (data: RegisterFormInputs) => {
    console.log("Validated...", data);
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit };
};
