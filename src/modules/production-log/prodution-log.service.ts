import { getEntityManager } from "../../utils/get-entity-manager.util";
import { getRepository } from "../../utils/get-repository.util";
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

  async getTotalTypeCountMonth(id: number ,year : number,month : number) {
    const qb = this.productionLogRepository.qb('pl');
    const qbr = qb.select("SUM(amount) as amount, pt.name as name")
      .leftJoin('pl.type', 'pt')
      .where("EXTRACT(YEAR from pl.created_at) = ?", [year])
      .andWhere("EXTRACT(MONTH from pl.created_at) = ?", [month])
      .andWhere("pl.user_id = ?", [id])
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

  async getAllUserWithAmount(limit : number = 6, offset : number = 0, orderBy ? : "today_amount" | "month_amount" | "year_amount", order : "asc" | "desc" = "desc") {
    const qbr1 = this.productionLogRepository.getKnex()
      .sum('amount', {as : 'today_amount'})
      .select('u.id as user_id', 'u.name as name', 'u.profile_picture as profile_picture')
      .from('user as u')
      .leftJoin(
        this.productionLogRepository.getKnex()
          .from('production_log')
          .whereRaw("DATE(created_at)=DATE(now())")
          .as('pl')
        , 'u.id', 'pl.user_id')
      .groupBy('u.id')
      
      const qbr2 = this.productionLogRepository.getKnex()
      .sum('amount', {as : 'month_amount'})
      .select('u.id as user_id', 'u.name as name', 'u.profile_picture as profile_picture')
      .from('user as u')
      .leftJoin(
        this.productionLogRepository.getKnex()
          .from('production_log')
          .whereRaw("EXTRACT(YEAR from created_at)=EXTRACT(YEAR from now())")
          .andWhereRaw("EXTRACT(MONTH from created_at)=EXTRACT(MONTH from now())")
          .as('pl')
        , 'u.id', 'pl.user_id'
      )
      .groupBy('u.id')
      
    const qbr3 = this.productionLogRepository.getKnex()
      .sum('amount', {as : 'year_amount'})
      .select('u.id as user_id', 'u.name as name', 'u.profile_picture as profile_picture')
      .from('user as u')
      .leftJoin(
        this.productionLogRepository.getKnex()
          .from('production_log')
          .whereRaw("EXTRACT(YEAR from created_at)=EXTRACT(YEAR from now())")
          .as('pl')
        , 'u.id', 'pl.user_id'
      )
      .groupBy('u.id')

    const knex = this.productionLogRepository.getKnex()
    const knexQuery = 
      knex
        .select("*")
        .from(qbr3.as('t1'))
          .leftJoin(qbr2.as('t2'), 't1.user_id', 't2.user_id')
          .leftJoin(qbr1.as('t3'), 't2.user_id', 't3.user_id')
        .limit(limit)
        .offset(offset)

      orderBy && knexQuery.orderBy(orderBy, order, order == 'asc' ? 'first' : 'last')
    return  this.productionLogRepository.getEntityManager().getConnection().execute(knexQuery);
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
    return await this.productionLogRepository.findAndCount({...query, user : userId}, options)
  }

  async getLogTotalGroupByType(userId : number) {
    const qb = this.productionLogRepository.createQueryBuilder('pl')
      qb
        .select("SUM(amount) as amount, pt.name as name, pt.salary as salary")
        .leftJoin('pl.type', 'pt')
        .where("DATE(pl.created_at)=DATE(now())")
        .andWhere('user_id = ?', [userId])
        .groupBy('pt.id')
    return await qb.execute()
  }

  async getLogTotalGroupByTypeMonth(userId : number, year : number, month : number) {
    const qb = this.productionLogRepository.createQueryBuilder('pl')
      qb
        .select("SUM(amount) as amount, pt.name as name, pt.salary as salary")
        .leftJoin('pl.type', 'pt')
        .where("EXTRACT(YEAR from pl.created_at)=?", [year])
        .andWhere("EXTRACT(MONTH from pl.created_at)=?", [month])
        .andWhere('user_id = ?', [userId])
        .groupBy('pt.id')
    return await qb.execute()
  }

  async getLogTotalGroupByTypeYear(userId : number, year : number) {
    const qb = this.productionLogRepository.createQueryBuilder('pl')
      qb
        .select("SUM(amount) as amount, pt.name as name, pt.salary as salary")
        .leftJoin('pl.type', 'pt')
        .where("EXTRACT(YEAR from pl.created_at)=?", [year])
        .andWhere('user_id = ?', [userId])
        .groupBy('pt.id')
    return await qb.execute()
  }
}