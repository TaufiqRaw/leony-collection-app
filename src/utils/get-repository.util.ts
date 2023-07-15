import { EntityName } from "@mikro-orm/core";
import { PostgreSqlDriver, SqlEntityManager } from "@mikro-orm/postgresql";
import httpContext from "express-http-context"
import { CustomBaseEntity } from "./classes/custom-base.entity";

export function getRepository<T extends CustomBaseEntity>(repository : EntityName<T>){
  const em : SqlEntityManager<PostgreSqlDriver> = httpContext.get('em')!;
  return em.getRepository(repository)
}