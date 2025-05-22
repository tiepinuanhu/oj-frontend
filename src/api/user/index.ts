import instance from "../../axios/request";
import type { LoginParams,UserRegisterRequest } from "./type";




export const userLogin = (data: LoginParams) => {
  return instance({
    url: "/user/login",
    method: "post",
    data: data
  });
};

export const userRegister = (data: UserRegisterRequest) => {
  return instance({
    url: "/user/register",
    method: "post",
    data: data
  });
};
