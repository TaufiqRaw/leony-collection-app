import { getEntityManager } from "@/utils/get-entity-manager.util";
import { getRepository } from "@/utils/get-repository.util";
import { FilterQuery, FindOptions, wrap } from "@mikro-orm/core";
import { DatabaseService } from "../common/class/database.service";
import { ProductionLog, ProductionLogProps } from "./prodution-log.entity";

export class ProductionLogService extends DatabaseService<ProductionLog, ProductionLogProps> {
  private readonly productionLogRepository
  private readonly em = getEntityManager()

  constructor(){
    const productionLogRepository = getRepository(ProductionLog)
    super(productionLogRepository)
    this.productionLogRepository = productionLogRepository
  }

  async getTotalUserCount(userId : number, date : Date) {
    const qb = this.productionLogRepository.qb('pl');
    qb.select("SUM(amount) as amount")
      .where("pl.user_id = ?", [userId])
      .andWhere("DATE(pl.created_at) = ?", [date])
    return await qb.execute()
  }

  async getTotalUserCountMonth(userId : number,year : number, month : number) {
    const qb = this.productionLogRepository.qb('pl');
    qb.select("SUM(amount) as amount")
      .where("pl.user_id = ?", [userId])
      .andWhere("EXTRACT(YEAR from pl.created_at) = ?", [year])
      .andWhere("EXTRACT(MONTH from pl.created_at) = ?", [month])
    return await qb.execute()
  }   

  async getTotalUserCountYear(userId : number,year : number) {
    const qb = this.productionLogRepository.qb('pl');
    qb.select("SUM(amount) as amount")
      .where("pl.user_id = ?", [userId])
      .andWhere("EXTRACT(YEAR from pl.created_at) = ?", [year])
    return await qb.execute()
  }

  async getAllCountMonth(year : number,month : number) {
    const qb = this.productionLogRepository.qb('pl');
    qb.select("SUM(amount) as amount")
      .where("EXTRACT(YEAR from pl.created_at) = ?", [year])
      .andWhere("EXTRACT(MONTH from pl.created_at) = ?", [month])
    return await qb.execute()
  }

  async getAllCountDay(date : Date) {
    const qb = this.productionLogRepository.qb('pl');
    qb.select("SUM(amount) as amount")
      .where("DATE(pl.created_at) = ?", [date])
    return await qb.execute()
  }

  async getTotalTypeCountMonth(year : number,month : number) {
    const qb = this.productionLogRepository.qb('pl');
    const qbr = qb.select("SUM(amount) as amount, pt.name as name")
      .leftJoin('pl.type', 'pt')
      .where("EXTRACT(YEAR from pl.created_at) = ?", [year])
      .andWhere("EXTRACT(MONTH from pl.created_at) = ?", [month])
      .groupBy('pt.id')
      .getKnexQuery()

    const knex = this.productionLogRepository.getKnex()
    const knexQuery = knex.select("*").from(qbr.as('t1')).orderBy('amount', 'desc').limit(6)
    return  this.productionLogRepository.getEntityManager().getConnection().execute(knexQuery)
  }

  async getLogTotalAmount(userId : number, date : Date) {
    const qb = this.productionLogRepository.qb();
    qb.select("SUM(amount) as amount")
    qb.where({user : userId})
    qb.andWhere('DATE(created_at) = ?', [date])
    return await qb.execute()
  }

  async create(log : ProductionLogProps) {
    return await this.em.persistAndFlush(new ProductionLog(log))
  }

  async aggregateDailyAmount(userId: number) {
    return await this.productionLogRepository.createQueryBuilder("pl")
      .select('SUM(pl.amount) as amount')
      .where({user : userId})
      .andWhere("DATE(pl.created_at) = Date(now())")
      .execute();
  }

  async aggregateMonthlyAmount(userId: number) {
    return  await this.productionLogRepository.createQueryBuilder("pl")
      .select('SUM(pl.amount) as amount')
      .where({user : userId})
      .andWhere("EXTRACT(YEAR from pl.created_at) = EXTRACT(YEAR from now())")
      .andWhere("EXTRACT(MONTH from pl.created_at) = EXTRACT(MONTH from now())")
      .execute();
  }

  async aggregateYearlyAmount(userId: number) {
    return  await this.productionLogRepository.createQueryBuilder("pl")
      .select('SUM(pl.amount) as amount')
      .where({user : userId})
      .andWhere("EXTRACT(YEAR from pl.created_at) = EXTRACT(YEAR from now())")
      .execute();
  }

  async getLogTotalAmountDay(userId: number, date: Date, length : number) {
    const startDate = (new Date(date)).setDate(date.getDate() - length + 1)

    const qb = this.productionLogRepository.qb();
    qb.select("SUM(amount) as amount, DATE(created_at) as date")
    qb.where({user : userId})
    qb.andWhere('DATE(created_at) >= ?', [new Date(startDate)])
    qb.groupBy('DATE(created_at)')

    return await qb.execute()
  }

  async getLogByUser(userId: number, query : FilterQuery<ProductionLog> = {}, options ?: FindOptions<ProductionLog>) {
    //@ts-ignore
    return await this.productionLogRepository.find({...query, user : userId}, options)
  }
}