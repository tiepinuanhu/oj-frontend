export interface UserVO {
    id: number;
    userAccount: string;
    userName: string;
    userAvatar: string;
    userProfile: string;
    token: string;
    userRole: string;
    createTime: Date;
}
export interface LoginParams {
    userAccount: string;
    userPassword: string;
}

// 定义接口来对应Java类的结构
export interface UserRegisterRequest {
    userAccount: string;
    userPassword: string;
    checkPassword: string;
}