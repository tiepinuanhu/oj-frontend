import { defineStore } from "pinia";
import {reactive, ref} from "vue"
import instance from "../axios/request";
import { User } from "@element-plus/icons-vue";
import { userLogin } from "../api/user";
import { ElMessage } from "element-plus";
export const useUserStore = defineStore("user", () => {

  const user = reactive({
    userId: 0,
    userAccount: "",
    userName: "",
    userAvatar: "",
    userRole: 0,
  })
  const token = ref("")
  const tagVisible = ref(true)
  const currentPath = ref("")
  async function setToken(token1: string) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token1}`
    token.value = token1
  }

  // async function getToken() {
  //   const token = localStorage.getItem("token")
  //   if (token) {
  //     setToken(token)
  //     return true
  //   }
  //   return false
  // }

  async function logout() {
    instance.defaults.headers.common["Authorization"] = ""
    token.value = ""
    
  }
  const isLogin = () => {
    return token.value !== ""
  }
  // const autoLogin = async () => {
  //   const token = localStorage.getItem('token')
    
  //   // 验证token是否有效
  //   if (token) {
  //     // 从token中解析出用户基本信息
  //   }
  //   const localUser = localStorage.getItem('user');
  //   const res =  await userLogin({userAccount: localUser.userAccount, userPassword: localUser.userPassword})
  //   if (res) {
  //     user.userName = res.data.userName
  //     user.userAvatar = res.data.userAvatar
  //     ElMessage.success('自动登录成功')
  //     ElMessage.success()
  //   } else {
  //     ElMessage.error('自动登录失败')
  //   }
  // }
   
  return {user, token, setToken,logout, isLogin, tagVisible,currentPath}
},
{
  persist: true,
}
)