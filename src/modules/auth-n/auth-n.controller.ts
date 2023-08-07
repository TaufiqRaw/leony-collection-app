import { ExpressError } from "../../utils/classes/express-error.util";
import { validateRequest } from "../../utils/validate-request.util";
import { Request, Response } from "express";
import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import bcrypt from 'bcrypt'
import { ValidationError } from "class-validator";

export class AuthNController{
  private readonly userService = new UserService()
  
  public loginPage(req : Request, res : Response){
    res.render('login')
  }

  async login(req : Request, res : Response){
    const user = await validateRequest(req, LoginDto).catch(err=>{
        req.flash('error', err.message)
        return res.redirect('/auth/login')
    })

    if(!user)
      return res.redirect('/auth/login')

    const userEntity = await this.userService.getUserByName(user.name)
    if(!userEntity){
      req.flash('error', 'Invalid username or password')
      return res.redirect('/auth/login')
    }

    if(!(await bcrypt.compare(user.password, userEntity.password))){
      req.flash('error', 'Invalid username or password')
      return res.redirect('/auth/login')
    }
    
    req.session.user = userEntity

    if(userEntity.isAdmin)
      return res.redirect('/admin')
    res.redirect('/dashboard')
  }

  async logout(req : Request, res : Response){
    req.session.destroy(err=>{
      if(err)
        throw new ExpressError('Failed to logout', 500)
      res.redirect('/auth/login')
    })
  }
}