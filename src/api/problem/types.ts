import type { UserVO } from "../user/type";
import type { Tag } from "../tag";
// 假设 CommonConstant 是一个常量对象，包含 SORT_ORDER_ASC 常量
const CommonConstant = {
    SORT_ORDER_ASC: 'asc',
    SORT_ORDER_DESC: 'desc'
};

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

export interface ProblemQueryRequest extends PageRequest {
    id?: string;
    title?: string;
    tags?: Tag[];
    userId?: string;
    level?: number;
}

/** 基于 Elasticsearch 的题目全文检索请求 */
export interface ProblemEsQueryRequest extends PageRequest {
    /** 检索关键词（匹配 title + 题面） */
    searchText: string;
    /** 当前用户 id（权限过滤） */
    userId?: string;
}
export interface JudgeConfig {
    memoryLimit?: number;
    timeLimit?: number;
}
export interface ProblemVO {
    id?: number;
    title?: string;
    content?: string;
    tags?: Tag[];
    level?: number;
    submittedNum?: number;
    acceptedNum?: number;
    publisherName: string;
    publisherId?: string;
    judgeConfig?: JudgeConfig;
    createTime?: Date;
    isPublic?:boolean
}
export interface ProblemEditRequest {
    id:string
  title: string;
  content: string;
  tags: number[];
  level: number;
  judgeConfig: JudgeConfig; // 裁判配置对象
  userId: string; // Java 的 Long 对应 TypeScript 的 number
  isPublic:boolean
}

export interface ProblemAddRequest {
  title: string;
  content: string;
  tags: number[];
  level: number;
  judgeConfig: JudgeConfig; 
  publisherId: string
  isPublic:boolean
}

export interface UploadStandardRequest {
  problemId: number;
  sourceCode: string;
}

export interface StandardSolutionVO {
  problemId: number;
  language: string;
  sourceCode?: string;
}

export interface UploadStandardVO {
  problemId: number;
  language: string;
  saved: boolean;
  outsRegenerated?: boolean;
  regenerateResult?: GenerateCasesVO;
}

export interface GenerateCaseItemVO {
  index: number;
  ok: boolean;
  output?: string;
  timeCost?: number;
  memoryUsed?: number;
  status?: string;
  error?: string;
}

export interface GenerateCasesVO {
  problemId: number;
  persisted: boolean;
  successCount: number;
  failCount: number;
  cases: GenerateCaseItemVO[];
}