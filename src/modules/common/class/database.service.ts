import { CustomBaseEntity } from "../../../utils/classes/custom-base.entity";
import { ExpressError } from "../../../utils/classes/express-error.util";
import { EntityLoaderOptions, FilterQuery, FindOneOptions, FindOptions, QueryFlag, QueryOrder } from "@mikro-orm/core";
import { EntityRepository } from "@mikro-orm/postgresql";

interface findAndPaginateOption<T> extends Omit<FindOptions<T, never>, 'offset' | 'limit' | 'flags'> {}

export abstract class DatabaseService<T extends CustomBaseEntity, EntityProp>{
  constructor(
      private readonly repository : EntityRepository<T>,
  ){}

  abstract create(constructorType : EntityProp) : Promise<void>

  async all(option? : findAndPaginateOption<T>) : Promise<T[]>{
      return await this.repository.findAll({...option});
  }

  async find(query : FilterQuery<T>, option? : FindOptions<T>) : Promise<T[]>{
      return await this.repository.find(query, option);
  }

  async findAndPaginate(query : FilterQuery<T>, page : number, limit : number, option? : findAndPaginateOption<T>){
      return await this.repository.findAndCount(query, {
          offset : (page - 1) * limit,
          limit,
          flags : [QueryFlag.PAGINATE],
          //@ts-ignore
          orderBy : { createdAt : QueryOrder.DESC },
          ...option
      })
  }

  async populate(entity : T, populate: boolean | never[], options ? : EntityLoaderOptions<T, never>){
      return await this.repository.populate(entity, populate, options);
  }

  async findOne(id:number, option? : FindOneOptions<T>):Promise<T|null>{
      const o = await this.repository.findOne(id as any, option);
      return o;
  }

  async findOrThrow(id:number):Promise<T>{
      const o = await this.repository.findOne(id as any);
      if(!o)
          throw new ExpressError('Item Not found', 404);
      return o;
  }

  async findAndUpdate(id : number, setAttr : Partial<EntityProp>){
      const entity = await this.findOne(id)
      if(!entity)
          throw new ExpressError('Item Not Found', 404);
      
      await this.setter(entity, setAttr)
  
      return await this.flush();
  }

  async setter(entity:T , setAttr : Partial<EntityProp>):Promise<void>{
      let key: keyof typeof setAttr;
      for(key in setAttr){
          if(typeof setAttr[key] !== 'undefined')
              //@ts-ignore
              entity[key] = setAttr[key]
      }
  }

  async bulkDestroy(ids : number[]){
    //@ts-ignore
    const orders = await this.find({id : {$in : ids}});

    orders.forEach((order)=>{
      this.repository.getEntityManager().remove(order);
    })

    await this.repository.getEntityManager().flush();
  }

  async flush(): Promise<never | void>{
      return await this.repository.getEntityManager().flush();
  }

  async persistAndFlush(entity : T): Promise<never | void>{
      return await this.repository.getEntityManager().persistAndFlush(entity);
  }
}
