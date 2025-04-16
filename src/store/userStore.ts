import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    // 其他用户相关状态
  }),
  actions: {
    setUsername(username: string) {
      this.username = username;
    },
  },
});
