import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql"
import httpContext from "express-http-context"

export function getEntityManager(): SqlEntityManager<PostgreSqlDriver> {
  return httpContext.get('em')!;
}