import { getRepository } from "@/utils/get-repository.util";
import { DatabaseService } from "../common/class/database.service";
import { User, UserProps } from "./user.entity";
import {hash} from "bcrypt"
export class UserService extends DatabaseService<User, UserProps> {
  private readonly userRepository;

  constructor(){
    const userRepository = getRepository(User)
    super(userRepository)
    this.userRepository = userRepository;
  }

  async create(constructorType: UserProps): Promise<void> {
    constructorType.password = await hash(constructorType.password, 12)
    const user = new User(constructorType)
    await this.persistAndFlush(user)
  }

  async setter(entity: User, setAttr: Partial<UserProps>): Promise<void> {
    if(setAttr.password)
      setAttr.password = await hash(setAttr.password, 12)
    await super.setter(entity, setAttr)
  }

  public async getUser(id: number) {
    return await this.userRepository.findOne(id)
  }

  public async getUserByName(name: string) {
    return await this.userRepository.findOne({ name })
  }
}