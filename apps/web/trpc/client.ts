import { createTRPCReact } from "@trpc/react-query"
import { httpBatchLink } from "@trpc/client"
import { ServerRouter } from "@repo/trpc/client"
import { authStore } from "~/lib/auth"

export const trpc = createTRPCReact<ServerRouter>()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL + "/trpc",
      headers: () => {
        const token = authStore.getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
      },
    }),
  ],
})