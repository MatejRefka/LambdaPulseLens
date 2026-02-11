import { useState, type FormEvent } from "react";

export const useRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("user registered!");
  };

  return { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, handleRegisterSubmit };
};
