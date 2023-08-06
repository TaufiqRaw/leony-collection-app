import { Entity, Index, ManyToOne, Property, Ref, Unique } from "@mikro-orm/core";
import moment from "moment";
import { EntityWithoutBase } from "../../types/entity-without-base.type";
import { CustomBaseEntity } from "../../utils/classes/custom-base.entity";
import { ProductionType } from "../production-type/production-type.entity";
import { User } from "../user/user.entity";

export interface ProductionLogProps extends Omit<EntityWithoutBase<ProductionLog>, 'timeAgo'>{}

@Entity()
export class ProductionLog extends CustomBaseEntity{
  @ManyToOne({onDelete : 'cascade', onUpdateIntegrity : 'cascade'})
  user : Ref<User>;

  @Property()
  amount : number;
  
  @ManyToOne({onDelete : 'set null', onUpdateIntegrity : 'cascade', nullable : true})
  type : Ref<ProductionType>;

  constructor({amount, user, type} : ProductionLogProps){
      super();
      this.amount = amount;
      this.user = user;
      this.type = type;
  }

  @Property({ persist: false })
  get timeAgo() {
    return moment(this.createdAt).locale("id").fromNow();
  }
}