import { Collection, Entity, Index, OneToMany, Property, Unique } from "@mikro-orm/core";
import { EntityWithoutBase } from "../../types/entity-without-base.type";
import { CustomBaseEntity } from "../../utils/classes/custom-base.entity";
import { ProductionLog } from "../production-log/prodution-log.entity";

export interface UserProps extends Omit<EntityWithoutBase<User>, "productionLogs">{}

@Entity()
export class User extends CustomBaseEntity{
  @Property()
  @Index()
  name : string;
  
  @Property({hidden:true})
  password : string;
  
  @Property()
  isAdmin = false;

  @Property()
  profilePicture? : string; 

  @OneToMany({entity : ()=>ProductionLog,mappedBy : productionLog => productionLog.user})
  productionLogs = new Collection<ProductionLog>(this);

  constructor({name,isAdmin = false,password, profilePicture} : UserProps){
      super();
      this.name = name,
      this.isAdmin = isAdmin
      this.password = password;
      this.profilePicture = profilePicture;
  }
}