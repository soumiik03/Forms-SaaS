export const authStore = {
    getToken: () => {
      if (typeof window === "undefined") return null
      return localStorage.getItem("fc_token")
    },
    setToken: (token: string) => {
      localStorage.setItem("fc_token", token)
    },
    clearToken: () => {
      localStorage.removeItem("fc_token")
    },
    isLoggedIn: () => {
      return !!authStore.getToken()
    },
  }