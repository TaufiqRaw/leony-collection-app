import { getService } from "@/utils/get-service.util";
import { validateRequest } from "@/utils/validate-request.util";
import { Request, Response } from "express";
import _ from "lodash";
import moment from "moment";
import { getPagination } from "../common/util/get-pagination.util";
import { ProductionLogService } from "../production-log/prodution-log.service";
import { ProductionTypeService } from "../production-type/production-type.service";
import { UserService } from "../user/user.service";
import { CreateProductionTypeDto } from "./dto/create-production-type";
import { CreateUserDto } from "./dto/create-user.dto";
import { EditUserDto } from "./dto/edit-user.dto";

export class AdminController {
  private readonly userService = getService(UserService)
  private readonly productionLogService = getService(ProductionLogService)
  private readonly productionTypeService = getService(ProductionTypeService)

  async dashboard(req : Request, res : Response) {
    const today = moment()
    const monthlyProduction = await this.productionLogService.getAllCountMonth(today.year(), today.month() + 1)

    const yestermonth = moment().subtract(1, 'month')
    const yestermonthProduction = await this.productionLogService.getAllCountMonth(yestermonth.year(), yestermonth.month())

    const dailyProduction = []
    for(let i = moment().date(); i >= 0; i--){
      const date = moment().subtract(i, "days")
      const amount = (await this.productionLogService.getAllCountDay(date.toDate()))[0].amount
      dailyProduction.push({date : date.format('DD MMM'), amount : amount || 0})
    }

    const mostType = await this.productionTypeService.getMostProductedItemType(today.year(), today.month() + 1)

    const recentProduction = await this.productionLogService.findAndPaginate({}, 1, 6, {orderBy : {createdAt : 'DESC'}, populate : ['user', 'type'] as never[]})
    
    return res.render('admin/dashboard', {monthlyProduction : monthlyProduction[0].amount, mostType ,recentProduction, dailyProduction, productionPercentage : yestermonthProduction[0].amount == 0 ? undefined : ((monthlyProduction[0].amount - yestermonthProduction) / yestermonthProduction[0].amount) * 100})
  }

  //USER ==========================================================================================================

  async user(req : Request, res : Response) {
    const pagination = getPagination(req)
    const rawUsers = await this.userService.findAndPaginate({}, 1, 10);
    const users = await Promise.all(rawUsers[0].map(async(user) => {
      const today = (await this.productionLogService.aggregateDailyAmount(user.id!))[0]
      const month = (await this.productionLogService.aggregateMonthlyAmount(user.id!))[0]
      const year = (await this.productionLogService.aggregateYearlyAmount(user.id!))[0]
      return {...user, today, month, year}
    }))
    return res.render('admin/user/index', {users : [users, rawUsers[1]], pagination})
  }

  async addUserForm(req : Request, res : Response) {
    return res.render('admin/user/form')
  }

  async addUser(req : Request, res : Response) {
    const reqData = await validateRequest(req, CreateUserDto).catch(err => {
      req.flash('error', err.message)
    })

    if(!reqData)
      return res.redirect('/admin/user/add');

    await this.userService.create({...reqData, isAdmin : false, profilePicture : req.file? req.file.filename : undefined})
    req.flash('success', 'User berhasil ditambahkan')
    return res.redirect('/admin/user')
  }

  async editUserForm(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'User tidak ditemukan')
      return res.redirect('/admin/user')
    }

    try{
      const data = await this.userService.findOne(id)
      return res.render('admin/user/form', {data, edit : true})
    }catch(err){
      req.flash('error', 'User tidak ditemukan')
      return res.redirect('/admin/user')
    }
  }

  async deleteUser(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'User tidak ditemukan')
      return res.redirect('/admin/user')
    }
    await this.userService.bulkDestroy([id])
    req.flash('success', 'User berhasil dihapus')
    return res.redirect('/admin/user')
  }

  async editUser(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'User tidak ditemukan')
      return res.redirect('/admin/user')
    }
    const reqData = await validateRequest(req, EditUserDto).catch(err => {
      req.flash('error', err.message)
    })

    if(!reqData)
      return res.redirect(`/admin/user/${id}/edit`);
    
    await this.userService.findAndUpdate(id, {...reqData, profilePicture : req.file? req.file.filename : undefined})
    req.flash('success', 'User berhasil diubah')
    return res.redirect('/admin/user')
  }

  //PRODUK ==========================================================================================================

  async produk(req : Request, res : Response) {
    const pagination = getPagination(req)
    const productionTypes = await this.productionTypeService.findAndPaginate({}, pagination.page, pagination.limit);
    return res.render('admin/produk/index', {productionTypes, pagination})
  }

  async addProduk(req : Request, res : Response) {
    const reqData = await validateRequest(req, CreateProductionTypeDto).catch(err => {
      req.flash('error', err.message)
    })

    if(!reqData)
      return res.redirect('/admin/produk/add');

    await this.productionTypeService.create(reqData)

    req.flash('success', 'Produk berhasil ditambahkan')
    return res.redirect('/admin/produk')
  }

  async deleteProduk(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'Produk tidak ditemukan')
      return res.redirect('/admin/produk')
    }

    await this.productionTypeService.bulkDestroy([id])
    req.flash('success', 'Produk berhasil dihapus')
    return res.redirect('/admin/produk')
  }

  async addProdukForm(req : Request, res : Response) {
    return res.render('admin/produk/form')
  }

  async editProdukForm(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'Produk tidak ditemukan')
      return res.redirect('/admin/produk')
    }

    const data = await this.productionTypeService.findOne(id)

    return res.render('admin/produk/form', {data, edit : true})
  }

  async editProduk(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'Produk tidak ditemukan')
      return res.redirect('/admin/produk')
    }
    const reqData = await validateRequest(req, CreateProductionTypeDto).catch(err => {
      req.flash('error', err.message)
    })

    if(!reqData)
      return res.redirect(`/admin/produk/${id}/edit`);

    await this.productionTypeService.findAndUpdate(id, reqData)
    req.flash('success', 'Produk berhasil diubah')
    return res.redirect('/admin/produk')
  }

  // PRODUKSI ==========================================================================================================

  async produksi(req : Request, res : Response) {
    const pagination = getPagination(req)
    const productionLogs = await this.productionLogService.findAndPaginate({}, pagination.page, pagination.limit, {populate : ['user', 'type'] as never[], orderBy : {createdAt : 'DESC'}})
    return res.render('admin/produksi/index', {productionLogs, pagination})
  }

  async deleteProduksi(req : Request, res : Response) {
    const id = _.parseInt(req.params.id)
    if(!id){
      req.flash('error', 'Produksi tidak ditemukan')
      return res.redirect('/admin/produksi')
    }

    await this.productionLogService.bulkDestroy([id])
    req.flash('success', 'Produksi berhasil dihapus')
    return res.redirect('/admin/produksi')
  }
}