import instance from "../../utils/request";




export const userLogin = (data: any) => {
  return instance({
    url: "/user/login",
    method: "post",
    data: data
  });
};

