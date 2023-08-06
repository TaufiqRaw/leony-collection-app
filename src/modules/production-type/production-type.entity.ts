import { Collection, Entity, Index, ManyToOne, OneToMany, Property, Ref, Unique } from "@mikro-orm/core";
import { EntityWithoutBase } from "../../types/entity-without-base.type";
import { CustomBaseEntity } from "../../utils/classes/custom-base.entity";
import { ProductionLog } from "../production-log/prodution-log.entity";

export interface ProductionTypeProps extends Omit<EntityWithoutBase<ProductionType>, 'productionLogs'>{}

@Entity()
export class ProductionType extends CustomBaseEntity{

  @Property()
  salary : number;

  @Property()
  @Unique()
  name : string;

  @OneToMany({entity : ()=>ProductionLog, mappedBy : ProductionLog => ProductionLog.type})
  productionLogs = new Collection<ProductionLog>(this);

  constructor({salary, name} : ProductionTypeProps){
      super();
      this.salary = salary;
      this.name = name;
  }
}