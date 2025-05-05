import instance from "../../axios/request";
import type { PageRequest, RegisterDTO } from "./types";



export const getContestList = (data: PageRequest) => {
  return instance({
    url: "/contest/list/page/vo",
    method: "post",
    data: data
  });
}
export const getContest = (id : number) => {
  return instance({
    url: "/contest/get/vo",
    method: "get",
    params: {
      id:id
    }
  });
}
// export const addContest = (data: PageRequest) => {
//   return instance({
//     url: "/contest/list/page/vo",
//     method: "post",
//     data: data
//   });
// }

export const registerContest = (data: RegisterDTO) => {
  return instance({
    url: "/contest/list/page/vo",
    method: "post",
    data:data
  });
}
export const isReg = (data: RegisterDTO) => {
  return instance({
    url: "/contest/user/isReg",
    method: "post",
    data:data
  });
}
export const canReg = (data: RegisterDTO) => {
  return instance({
    url: "/contest/user/canReg",
    method: "post",
    data:data
  });
}
export const getProblemsInContest = (cid: number) => {
  return instance({
    url: "/contest/problems",
    method: "get",
    params: {
      contestId: cid
    }
  });
}