import { resolveUserFromToken } from "@repo/services/auth";
import type { Request, Response } from "express";

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) {
  const token = req.headers["authorization"]?.split(" ")[1];
  const user = await resolveUserFromToken(token);

  return { user, token: token ?? null };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
