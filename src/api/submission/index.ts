import instance from "../../axios/request";
import type { SubmissionAddRequest,SubmissionQueryDTO } from "./types";

export const addSubmission = (data: SubmissionAddRequest) => {
    return instance({
      url: `/submission/submit`, 
      method: "post", 
      data: data
    });
};

export const getSubmissions = (data: SubmissionQueryDTO) => {
    return instance({
      url: `/submission/list/page`, 
      method: "post", 
      data: data
    });
};
export const getSubmissionById = (id: number) => {
    return instance({
      url: `/submission/get`, 
      method: "get", 
      params: { id }
    });
};