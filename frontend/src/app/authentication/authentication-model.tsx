"use client";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User } from "@/domain/models/user";
import {
  CreateUserBody,
  CreateUserServiceContract,
} from "@/data/user-service/create-user-service";
import { enqueueSnackbar } from "notistack";

export type UserServiceRegistry = {
  createUserService: CreateUserServiceContract;
};

export const useAuthenticationModel = (props: UserServiceRegistry) => {
  const { createUserService } = props;

  const [showLoginForm, setShowLoginForm] = useState(true);
  const [signUpForm, setSignUpForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: createUser, data, isSuccess:isSuccessCreateUser} = useMutation<User, Error, CreateUserBody>({
    mutationFn: (data:CreateUserBody) => createUserService.exec(data),
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
    console.log("🚀 ~ handleCreateUser ~ isSuccessCreateUser:", isSuccessCreateUser)
    if(isSuccessCreateUser){
      enqueueSnackbar('Usuário criado com sucesso!', { variant: 'success' })
    }

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

  };
};
