export interface SubmissionAddRequest {
    problemId?: number; // 可选字段（对应 Java 中可能为 null 的 Long）
    sourceCode?: string;
    language?: string;
}


export interface JudgeCaseResult {
  input: string; // 输入内容
  output: string; // 程序输出
  ans: string; // 正确答案
  message: string; // 判题状态（如 Accepted、Wrong Answer 等）
  timeCost: string; // 时间消耗（单位可能为 ms，如 "10ms"）
  memoryUsed: string; // 内存使用（单位可能为 KB，如 "20KB"）
}
export interface SubmissionResult {
    score: number;
    status: string;
    totalTime: number;
    memoryUsed: number;
    codeLength: number;
    judgeCaseResults: JudgeCaseResult[];
}
export interface SubmissionVO {
    id: number;
    userId: number;
    userAccount: string; // 新增字段
    problemId: number;
    problemTitle: string; // 新增字段
    sourceCode: string;
    totalTime: number;
    totalMemory: number;
    codeLength: number;
    submissionResult: SubmissionResult; // 关联类型
    status: number; // 状态码（整数）
    submissionStatus: string; // 状态描述（如 "waiting"）
    score: number; // 得分
    language: string; // 编程语言
    createTime: Date; // 时间类型
  }
export interface PageRequest {
    // 当前页号，默认值为 1
    current?: number;
    // 页面大小，默认值为 10
    pageSize?: number;
    // 排序字段
    sortField?: string;
    // 排序顺序（默认升序）
    sortOrder?: string;
  }
export interface SubmissionQueryDTO extends PageRequest {
    problemId?: number;
    userId?: number;
    language?: string;
    JudgeResult?: string;
}