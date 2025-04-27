import instance from "../../axios/request";
import type { LoginParams } from "./type";




export const userLogin = (data: LoginParams) => {
  return instance({
    url: "/user/login",
    method: "post",
    data: data
  });
};

