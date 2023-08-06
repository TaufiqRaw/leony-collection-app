import { getRepository } from "@/utils/get-repository.util";
import { QueryOrder } from "@mikro-orm/core";
import { DatabaseService } from "../common/class/database.service";
import { ProductionType, ProductionTypeProps } from "./production-type.entity";

export class ProductionTypeService extends DatabaseService<ProductionType, ProductionTypeProps>{
  private readonly productionTypeRepository;

  constructor(){
    const productionTypeRepository = getRepository(ProductionType)
    super(productionTypeRepository)
    this.productionTypeRepository = productionTypeRepository;
  }

  async create(props : ProductionTypeProps){
    const productionType = new ProductionType(props)
    return await this.persistAndFlush(productionType)
  }

  async getMostProductedItemType(year : number, month : number){
    const qb = this.productionTypeRepository.createQueryBuilder('pt')
    const qbr = qb
      .select('pt.id, pt.name, SUM(pl.amount) as amount')
      .leftJoin('pt.productionLogs', 'pl')
      .groupBy('pt.id')
      .where("EXTRACT(YEAR from pl.created_at) = ?", [year])
      .andWhere("EXTRACT(MONTH from pl.created_at) = ?", [month])
      .limit(1)
      .getKnexQuery()

    const knex = this.productionTypeRepository.getKnex()
    const knexQuery = knex.select("*").from(qbr.as('t1')).orderBy('amount', 'desc').limit(1)

    return await this.productionTypeRepository.getEntityManager().getConnection().execute(knexQuery)
  }
}