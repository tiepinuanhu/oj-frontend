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