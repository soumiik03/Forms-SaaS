import { httpBatchLink } from "@trpc/client"
import { authStore } from "~/lib/auth"

export const createTRPCHttpBatchClientClient = () => {
  return httpBatchLink({
    url: process.env.NEXT_PUBLIC_API_URL + "/trpc",
    headers: () => {
      const token = authStore.getToken()
      return token ? { Authorization: `Bearer ${token}` } : {}
    },
  })
}