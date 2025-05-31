export interface SubmissionAddRequest {
    userId:  string;
    problemId?: string; // 可选字段（对应 Java 中可能为 null 的 Long）
    sourceCode?: string;
    language?: string;
}


export interface JudgeCaseResult {
  index: number;
  input: string; // 输入内容
  output: string; // 程序输出
  ans: string; // 正确答案
  judgeResult: string; // 判题状态（如 Accepted、Wrong Answer 等）
  gainScore: number;
  fullScore: number;
  timeCost: string; // 时间消耗（单位可能为 ms，如 "10ms"）
  memoryUsed: string; // 内存使用（单位可能为 KB，如 "20KB"）
}
export interface SubmissionResult {
    score: number;
    status: number;
    statusDescription:string
    compileErrorMessage:string
    totalTime: number;
    memoryUsed: number;
    judgeCaseResults: JudgeCaseResult[];
}
export interface SubmissionVO {
    id: number;
    userId: number;
    userAccount: string; // 新增字段
    problemId: number;
    problemTitle: string; // 新增字段
    sourceCode: string;
    codeLength: number;
    submissionResult: SubmissionResult; // 关联类型
    submissionStatus: string; // 状态描述（如 "waiting"）
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
    problemId?: string;
    userId?: string;
    language?: string;
    judgeResult?: string;
}
// 评测结果分布项
export interface ResultDistributionItem {
  status: string; // 状态（如"Compile Error"、"Accepted"）
  count: number;  // 数量
}

// 数据主体
export interface ProblemStatisticsVO {
  problemId: string;              // 题目ID（注意：后端返回为字符串类型）
  submittedCount: number;         // 总提交次数
  resultDistributions: ResultDistributionItem[]; // 结果分布数组
  timeCount: number[]
}