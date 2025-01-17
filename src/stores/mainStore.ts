import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
  state: () => ({
    message: 'Hola desde Pinia',
  }),
  getters: {
    uppercaseMessage: (state) => state.message.toUpperCase(),
  },
  actions: {
    updateMessage(newMessage: string) {
      this.message = newMessage;
    },
  },
});
