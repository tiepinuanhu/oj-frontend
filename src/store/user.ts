import { defineStore } from "pinia";
import {ref} from "vue"
import instance from "../utils/request";
export const useUserStore = defineStore("user", () => {

  const userInfo = ref({
    token: localStorage.getItem("token") || "",
  })

  

  async function setToken(token: string) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token", token)
  }

  async function getToken() {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
      return true
    }
    return false
  }

  async function logout() {
    instance.defaults.headers.common["Authorization"] = ""
    localStorage.removeItem("token")
  }
  return {setToken, getToken,logout}
})