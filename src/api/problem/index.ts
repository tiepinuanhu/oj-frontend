import instance from "../../axios/request";
import type {
  ProblemQueryRequest,
  ProblemEditRequest,
  ProblemAddRequest,
  ProblemEsQueryRequest,
  UploadStandardRequest,
} from "./types";
import { ElMessage } from "element-plus";

export const listProblemVOByPage = (data: ProblemQueryRequest) => {
  return instance({
    url: "/problem/list/page/vo",
    method: "post",
    data: data
  });
};

/** 基于 Elasticsearch 的题目关键词全文检索 */
export const searchProblemByEs = (data: ProblemEsQueryRequest) => {
  return instance({
    url: "/problem/search",
    method: "post",
    data: data
  });
};

export const getProblemById = (id: string) => {
  return instance({
    url: `/problem/get/vo`,
    method: "get",
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

export const getProblemsNotPub = () => {
  return instance({
    url: `/problem/notPublished`,
    method: "get",
  });
};

export const checkProblemCanUsedInContest = (contestId: string, problemId: string) => {
  return instance({
    url: `/problem/get/check`,
    method: "get",
    params: { contestId, problemId }
  });
};

export const getNotPublicProblems = () => {
  return instance({
    url: `/problem/get/notPublic`,
    method: "get",
  });
};

/** 上传 C++ 标程（编译通过后写入数据库） */
export const uploadStandard = (data: UploadStandardRequest) => {
  return instance({
    url: "/problem/uploadStandard",
    method: "post",
    data,
    timeout: 120000,
  });
};

/** 查询题目标程（样例管理回填） */
export const getStandard = (problemId: number | string) => {
  return instance({
    url: "/problem/getStandard",
    method: "get",
    params: { problemId },
  });
};

/**
 * 上传多个 .in 或 .zip，后端按标程生成并覆盖样例
 */
export const generateCasesByFiles = (problemId: number | string, files: File[]) => {
  const formData = new FormData();
  formData.append("problemId", String(problemId));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return instance({
    url: "/problem/generateCasesByFiles",
    method: "post",
    data: formData,
    timeout: 120000,
  });
};

export const uploadFiles = async (files: File[], url: string, token: string) => {
  if (!token) {
    return Promise.reject(new Error("未登录"));
  }

  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  });

  try {
    const response = await instance.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    ElMessage.success("上传成功");
    return response.data;
  } catch (error) {
    console.error("上传失败:", error);
    ElMessage.error("上传失败，请重试");
    return Promise.reject(error);
  }
};
