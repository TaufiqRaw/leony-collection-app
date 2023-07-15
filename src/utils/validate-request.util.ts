import { validateOrReject, ValidationError } from 'class-validator'
import { Request } from 'express'
import {Class} from '../types/class.type'
import { ExpressError } from './classes/express-error.util'
import { ValidatorError } from './classes/validator-error.util'

export const validateRequest = async <T extends object>(req : Request, dto : new ()=>T)=>{
  let dtoInstance = new dto()
  
  for(let key in req.body){
    //@ts-ignore
    dtoInstance[key] = req.body[key]
  }
  
  try{
    await validateOrReject(dtoInstance)
    return dtoInstance
  } catch(errors){
    throw new ValidatorError(errors as ValidationError[])
  }
}