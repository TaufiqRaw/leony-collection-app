import { getService } from "../../utils/get-service.util"
import { validateRequest } from "../../utils/validate-request.util"
import { wrap } from "@mikro-orm/core"
import { Request, Response } from "express"
import { ProductionLogService } from "../production-log/prodution-log.service"
import { ProductionTypeService } from "../production-type/production-type.service"
import { getProductionTypeUtil } from "../production-type/utils/get-production-type.util"
import { getUserUtil } from "../user/utils/get-user.util"
import { AddProductionLogDto } from "./dto/add-production-log.dto"

export class DashboardController{
  private readonly productionLogService = getService(ProductionLogService)
  private readonly productionTypeService = getService(ProductionTypeService)

  public async index(req: Request, res : Response){
    const id = (req.session.user!.id)!
    const todayContribution = (await this.productionLogService.getTotalUserCount(id, new Date()))[0].amount;
    const monthContribution = (await this.productionLogService.getTotalUserCountMonth(id, new Date().getFullYear(), new Date().getMonth() + 1))[0].amount;
    const yearContribution = (await this.productionLogService.getTotalUserCountYear(id, new Date().getFullYear()))[0].amount;
    const contributionsType = await this.productionLogService.getTotalTypeCountMonth(id ,new Date().getFullYear(), new Date().getMonth() + 1)
    const contributionsData = await this.productionLogService.getLogTotalAmountDay(id, new Date(), 31)
    const contributionsLog = await this.productionLogService.getLogByUser(id, {
      createdAt : {$gte : new Date((new Date()).setDate((new Date()).getDate() - 31))}
    },{limit : 31, orderBy : {createdAt : 'DESC'}})
    const productionTypes = await this.productionTypeService.all();
    return res.render('user/dashboard', {contributionsData, contributionsLog, productionTypes, contributionsType, todayContribution, monthContribution, yearContribution})
  }

  public async addProductionLog(req: Request, res : Response){
    const reqData = await validateRequest(req, AddProductionLogDto).catch(err=>{
        req.flash('error', err.message)
    })

    if(!reqData)
      return res.redirect('/dashboard')

    const {amount} = reqData

    if(amount <= 0){
      req.flash('error', 'Hasil kerja harus lebih dari 0')
      return res.redirect('/dashboard')
    }
    
    const id = (req.session.user!.id)!
    const type = await getProductionTypeUtil(reqData.type)
    await this.productionLogService.create({amount, user : wrap((await getUserUtil(id))).toReference(), type : wrap(type).toReference()})
    req.flash('success', 'Berhasil menambahkan hasil kerja')
    res.redirect('/dashboard')
  }
}