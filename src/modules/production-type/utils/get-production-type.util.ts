import { ExpressError } from "../../../utils/classes/express-error.util"
import { getService } from "../../../utils/get-service.util"
import { ProductionTypeService } from "../production-type.service"

export async function getProductionTypeUtil(id : number){
  const productionType = await getService(ProductionTypeService).findOne(id)
  if(!productionType) throw new ExpressError('User not found', 404)
  return productionType
} 