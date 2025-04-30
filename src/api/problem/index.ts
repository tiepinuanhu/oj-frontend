import instance from "../../axios/request";
import type { ProblemQueryRequest } from "./types";
// import type { LoginParams } from "./type";
// import type ProblemQueryRequest from "./types";




export const listProblemVOByPage = (data: ProblemQueryRequest) => {
  return instance({
    url: "/problem/list/page/vo",
    method: "post",
    data: data
  });
};

export const getProblemById = (id: number) => {
  return instance({
    url: `/problem/get/vo/${id}`, // 将题目编号作为路径参数
    method: "get", // 修改请求方法为 get
  });
};

