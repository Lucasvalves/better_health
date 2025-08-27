'use client'
import { useAuthenticationModel } from "./authentication-model";
import { AuthenticationView } from "./authentication-view";
import { HttpClient } from "@/infrastructure/http/http-client";
import { CreateUserService } from "@/data/user-service/create-user-service";

export const AuthenticationViewModel = () => {
    const httpClient = HttpClient.create()
    const createUserService = CreateUserService.create(httpClient)
    const methods = useAuthenticationModel({ createUserService })


 
  return <AuthenticationView {...methods} />;
};
