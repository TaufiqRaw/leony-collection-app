import { Class } from "../../types/class.type"

export class InstanceMap {
  private entries : any[] = []
  constructor(){}

  get(module : Class){
    return this.entries.find(entry => entry instanceof module)
  }

  add(module : any){
    this.entries.push(module)
  }

  remove(module : Class){
    this.entries = this.entries.filter(entry => !(entry instanceof module))
  }

  forEach(callback : (module : any)=>void){
    this.entries.forEach(callback)
  }
}