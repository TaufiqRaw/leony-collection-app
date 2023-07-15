import { getRepository } from "@/utils/get-repository.util";
import { User } from "./user.entity";

export class UserService {
  private userRepository = getRepository(User)

  public async getUser(id: number) {
    return await this.userRepository.findOne(id)
  }

  public async getUserByName(name: string) {
    return await this.userRepository.findOne({ name })
  }
}