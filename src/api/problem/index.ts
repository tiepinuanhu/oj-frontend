import instance from "../../axios/request";
import type { ProblemQueryRequest,ProblemEditRequest,ProblemAddRequest } from "./types";
// import type { LoginParams } from "./type";
import { ElMessage } from "element-plus";
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
    url: `/problem/get/vo`, // 将题目编号作为路径参数
    method: "get", // 修改请求方法为 get
    params: { id }
  });
};

export const addProblem = (data: ProblemAddRequest) => {
  return instance({
    url: `/problem/add`, 
    method: "post", 
    data: data
  });
};
export const editProblem = (data: ProblemEditRequest) => {
  return instance({
    url: `/problem/edit`, 
    method: "post", 
    data: data
  });
};
// export const createProblem = (userId: string) => {
//   return instance({
//     url: `/problem/create`, 
//     method: "put", 
//     params: { userId }
//   });
// };
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
export const getNotPublicProblems = () => {
  return instance({
    url: `/problem/get/notPublic`, 
    method: "get", 
  });
};
// 修改 uploadService.ts 支持多文件
export const uploadFiles = async (files: File[], url: string, token:string) => {
  
  if (!token) {
    return Promise.reject(new Error('未登录'));
  }
  
  const formData = new FormData();
  
  // 添加多个文件
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });
  
  // 其他逻辑保持不变
  try {
    const response = await instance.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    ElMessage.success('上传成功');
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败，请重试');
    return Promise.reject(error);
  }
};