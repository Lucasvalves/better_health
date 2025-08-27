"use client";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/domain/models/user";
import {
  CreateUserBody,
  CreateUserServiceContract,
} from "@/data/user-service/create-user-service";
import { enqueueSnackbar } from "notistack";
import { AxiosError } from "axios";

export type UserServiceRegistry = {
  createUserService: CreateUserServiceContract;
};
type ApiError = {
   message?: string;
};

export const useAuthenticationModel = (props: UserServiceRegistry) => {
  const { createUserService } = props;

  const [showLoginForm, setShowLoginForm] = useState(true);
  const [signUpForm, setSignUpForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const { mutate: createUser, data, isPending } =
  useMutation<User, AxiosError<ApiError>, CreateUserBody>({
    mutationFn: (data: CreateUserBody) => {
    return createUserService.exec(data);
},
    onError: (err) => {
      const message = err.response?.data?.message || 'Erro ao criar usuário.';
      enqueueSnackbar(message, { variant: 'error' });

    },
    onSuccess: () => {
      enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' });
    },
  });
  console.log("🚀 ~ useAuthenticationModel ~ data:", data)



  const handleForms = () => {
    if (!signUpForm) {
      setSignUpForm(true);
      setShowLoginForm(false);
    }
    if (!showLoginForm) {
      setShowLoginForm(true);
      setSignUpForm(false);
    }
  };
  const handleCreateUser = (e:FormEvent) =>{
    e.preventDefault()
    createUser({name:name, email:email, password:password})
    setName('')
    setEmail('')
    setPassword('')
  }

  return {
    showLoginForm,
    setShowLoginForm,
    signUpForm,
    setSignUpForm,
    handleForms,
    handleCreateUser,
    setName,
    setEmail,
    setPassword,
    name,
    email,
    password,
    isPending

  };
};
