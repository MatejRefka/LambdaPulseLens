import { useState, type FormEvent } from "react";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("User login!", { email, password });
  };

  return { email, setEmail, password, setPassword, handleLoginSubmit };
};
