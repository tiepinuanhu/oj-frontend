import instance from "../../axios/request";
import type { ProblemQueryRequest,ProblemEditRequest } from "./types";
// import type { LoginParams } from "./type";
// import type ProblemQueryRequest from "./types";




export const listProblemVOByPage = (data: ProblemQueryRequest) => {
  return instance({
    url: "/problem/list/page/vo",
    method: "post",
    data: data
  });
};

export const getProblemById = (id: string) => {
  return instance({
    url: `/problem/get/vo/${id}`, // 将题目编号作为路径参数
    method: "get", // 修改请求方法为 get
  });
};

// export const addProblem = (data: ProblemAddRequest) => {
//   return instance({
//     url: `/problem/add`, 
//     method: "post", 
//     data: data
//   });
// };
export const editProblem = (data: ProblemEditRequest) => {
  return instance({
    url: `/problem/edit`, 
    method: "post", 
    data: data
  });
};
export const createProblem = (userId: string) => {
  return instance({
    url: `/problem/create`, 
    method: "put", 
    params: { userId }
  });
};
// export const uploadCase = (userId: string) => {
//   return instance({
//     url: `/problem/create`, 
//     method: "put", 
//     params: { userId }
//   });
// };
export const getProblemsNotPub = () => {
  return instance({
    url: `/problem/notPublished`, 
    method: "get", 
  });
};
export const checkProblemCanUsedInContest = (contestId :string,problemId:string) => {
  return instance({
    url: `/problem/get/check`, 
    method: "get", 
    params: { contestId,problemId }
  });
};