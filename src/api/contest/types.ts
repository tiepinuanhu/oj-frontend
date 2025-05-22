import { ProblemVO } from "../problem/types";

import {SubmissionVO, SubmissionAddRequest} from "../submission/types"

export interface PageRequest {
    // 当前页号，默认值为 1
    current?: number;
    // 页面大小，默认值为 10
    pageSize?: number;
    // 排序字段
    sortField?: string;
    // 排序顺序，默认升序
    sortOrder?: string;
}
export interface ContestVO {
    id: string;
    title: string;
    description: string;
    startTime: Date;
    endTime: Date
    duration: number;
    status: number;
    isPublic: number;
    problemVOList: ProblemVO[];
    playerCount: number;
    hostName: string;
    hostId: string;
    canRegister:number
}
export interface ContestProblemVO {
    id?: number;
    pindex:number
    title?: string;
    content?: string;
    tags?: Tag[];
    level?: number;
    submittedNum?: number;
    acceptedNum?: number;
    userVO?: UserVO;
    judgeConfig?: JudgeConfig;
    createTime?: Date;
    fullScore:number
    gainScore:number
}
export interface RegisterDTO {
    userId: number;
    contestId: number;
}

export interface ContestSubmissionListDTO extends PageRequest {
    contestId: string;
    userId: string;
    selfOnly:number
}

export interface ContestSubmissionVO extends SubmissionVO {
    contestId: string;
    problemIndex:number
    contestTitle?: string;
}


export interface ContestSubmitDTO extends SubmissionAddRequest{
    contestId: string;
}
// 假设 RankProblemVO 接口如下（根据实际需求调整）
export interface RankProblemVO extends ContestProblemVO{
  firstBlood?: boolean;
  timeUsed:number
}
export interface RankItem {
  userId: number;
  userName: string;
  totalScore: number;
  usedTime: number;
  submitted: boolean;
  problemDetails: Map<number,RankProblemVO>; // 题目ID -> 题目详情
}
export interface RankResponse {
  data: RankItem[];
  problem: Map<number,number>; // 题目序号 -> 题目信息
}
export interface RankList {
    data: RankItem[];
}
// ContestProblemAddRequest.ts
export interface ContestProblemsUpdateRequest {
  contestId: string;
  problems: AddingProblem[];
}

// ContestProblemDTO.ts
export interface ContestProblemDTO {
  problemId: string;
  title?:string
  problemIndex: number;
  fullScore: number;
}
export interface AddingProblem {
    problemId: string;
    problemIndex: number;
    fullScore: number;
}
// ContestProblemSimpleVO.ts
export interface ContestProblemSimpleVO {
  problemId: string;
  problemIndex: number;
  fullScore: number;
  
  title: string;
  publisherName: string;
  publisherId: string;
  isPublic: boolean;
  createTime: Date; // 或 string（如果 API 返回 ISO 格式字符串）
}

// 更严格的类型定义示例
export interface ContestBaseUpdateRequest {
  contestId: string;
  title: string; 
  description: string;
  startTime: string;
  duration: number;
  isPublic:  number
  hostId: string;
}