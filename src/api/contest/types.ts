import { ProblemVO } from "@/api/problem/types";

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
    id: number;
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
    hostId: number;
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
}
export interface RegisterDTO {
    userId: number;
    contestId: number;
}