import { defineStore } from 'pinia'
import { userInterface } from '@/interface'

export const userStore = defineStore({
    id: 'user',
    state: () => {
        return {
            user: {} as userInterface
        }
    },
    getters: {
        getUser(state) {
            return state.user
        }
    },
    actions: {
        setUser(data: userInterface) {
            this.user = data
        }
    },
  })