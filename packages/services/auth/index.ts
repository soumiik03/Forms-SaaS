import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash)
}

export const generateSessionToken = () => {
  return randomBytes(32).toString("hex")
}
