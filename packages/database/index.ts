import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";
import {Pool} from "pg"
import  * as schema from "./schema"

const pool = new Pool({
    connectionString: env.DATABASE_URL,
})    

export const db = drizzle(pool, { schema });
export * from "drizzle-orm";
export * from "./schema";
export default db;
