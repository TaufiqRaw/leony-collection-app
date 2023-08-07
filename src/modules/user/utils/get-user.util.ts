import { ExpressError } from "../../../utils/classes/express-error.util";
import { getRepository } from "../../../utils/get-repository.util";
import { getService } from "../../../utils/get-service.util";
import { UserService } from "../user.service";

export async function getUserUtil(id : number){
  const user = await getService(UserService).getUser(id)
  if(!user) throw new ExpressError('User not found', 404)
  return user
} 