import instance from "../../axios/request";
import type { PageRequest, RegisterDTO,ContestSubmissionListDTO, 
  ContestSubmitDTO,ContestProblemsUpdateRequest,ContestBaseUpdateRequest,ContestAddRequest } from "./types";



export const getContestList = (data: PageRequest) => {
  return instance({
    url: "/contest/list/page/vo",
    method: "post",
    data: data
  });
}
export const getContest = (id : string) => {
  return instance({
    url: "/contest/get/vo",
    method: "get",
    params: {
      id:id
    }
  });
}
/**
 * ContestAddRequest
 * @param data 
 * @returns 
 */
export const addContest = (data: ContestAddRequest) => {
  return instance({
    url: "/contest/add",
    method: "post",
    data: data
  });
}

export const registerContest = (data: RegisterDTO) => {
  return instance({
    url: "/contest/register",
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
export const getProblemsInContest = (cid: string, uid:string) => {
  return instance({
    url: "/contest/problems",
    method: "get",
    params: {
      contestId: cid,
      userId:uid
    }
  });
}

export const getProblemInContest = (cid: string, idx:number) => {
  return instance({
    url: "/contest/problem/get",
    method: "get",
    params: {
      contestId: cid,
      index:  idx
    }
  });
}
export const getSubmissionsInContest = (contestSubmissionListDTO: ContestSubmissionListDTO) => {
  return instance({
    url: `/contest/submissions`, 
    method: "post", 
    data: contestSubmissionListDTO
  });
};

export const getContestSubmissionById = (sid : String) => {
  return instance({
    url: `/contest/submission/get`, 
    method: "get", 
    params: { sid }
  });
};

export const addSubmissionInContest = (data: ContestSubmitDTO) => {
  return instance({
    url: `/contest/problem/submit`, 
    method: "post", 
    data: data
  });
};

export const getSubmissionInContestById = (sid: string) => {
  return instance({
    url: `/contest/submission/get`, 
    method: "get", 
    params: { id:sid }
  });
};
export const getRankByContestId = (cid: string) => {
  return instance({
    url: `/contest/rank`, 
    method: "get", 
    params: { contestId:cid },
  });
};

/**
 * 修改比赛题目
 * @param data 
 * @returns 
 */
export const updateContestProblems = (data: ContestProblemsUpdateRequest) => {
  return instance({
    url: `/contest/UpdateContestProblem`, 
    method: "post", 
    data: data
  });
};
/**
 * 修改比赛基本信息(不包括题目)
 * @param data 
 * @returns 
 */
export const updateContestBaseInfo = (data : ContestBaseUpdateRequest) => {
  return instance({
    url: `/contest/update/base`, 
    method: "post", 
    data: data
  });
};
export const getContestProblemss = (cid: string) => {
  return instance({
    url: `/contest/problemss`, 
    method: "get", 
    params : { contestId:cid }
  });
};