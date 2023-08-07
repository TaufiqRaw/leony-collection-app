import { getService } from "../../utils/get-service.util"
import { Request, Response } from "express"
import { UserService } from "./user.service"

export class UserController {
  
  private readonly userService = getService(UserService)

  async index (req: Request, res: Response) {
    const users = await this.userService.getUser(1)
    res.json(users)
  }
}