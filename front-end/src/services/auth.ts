import jwtDecode from "jwt-decode";
import { post } from "./generic";
import validator from "validator";
import fs from 'fs'

interface RegisterInterface{
  email: string
  name: string
  password: string
  avatar?: File
}

export async function Register(infos: RegisterInterface) {
  try {
    const formData = new FormData();
    formData.append('email', infos.email)
    formData.append('name', infos.name)
    formData.append('password', infos.password)
    if(infos.avatar)
      formData.append('avatar', infos.avatar)
    const token = await post("/register", formData, true);
    localStorage.setItem("token", token);
  } catch (error) {
    throw error;
  }
}

export async function Login(email: string, password: string) {
  try {
    const token = await post("/login", { email, password });
    localStorage.setItem("token", token);
  } catch (error) {
    doLogout()
    throw error;
  }
}

export const doLogout = () => {
  localStorage.removeItem("token");
};

export function isLogged() {
  const token = localStorage.getItem("token");

  if (token && validator.isJWT(token)) {
    const jwt = jwtDecode<any>(token);
    if (jwt && jwt.exp && jwt.exp > new Date().valueOf() / 1000) {
      return true;
    }
  }

  doLogout();
  return false;
}
