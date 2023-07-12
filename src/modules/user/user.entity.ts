import { Entity, Index, Property, Unique } from "@mikro-orm/core";
import { EntityWithoutBase } from "../../types/entity-without-base.type";
import { CustomBaseEntity } from "../../utils/custom-base.entity";

interface UserProps extends EntityWithoutBase<User>{}

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

  constructor({name,isAdmin = false,password, profilePicture} : UserProps){
      super();
      this.name = name,
      this.isAdmin = isAdmin
      this.password = password;
      this.profilePicture = profilePicture;
  }
}