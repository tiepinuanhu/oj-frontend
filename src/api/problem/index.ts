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

