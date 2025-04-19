import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      username: '',
      id: 0,
      avatar:'https://i.ibb.co/XYFRqbD/grezman.jpg',
      token: '1234567890',
    };
  },
  actions: {
    setUsername(username: string) {
      this.username = username;
    },
  },
  getters: {

  },
})