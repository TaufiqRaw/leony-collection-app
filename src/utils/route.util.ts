import { Class } from "@/types/class.type";
import { NextFunction, Request, Response, Router } from "express";
import { getController } from "./get-controller.util";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export class Route {
  private router = Router();

  constructor(private readonly path : string){}

  private handlerWrapper(requestHandler : RequestHandler){
    return (req : Request, res : Response,next : NextFunction)=>{
      const result : any = Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
        return next(err)
      })
    }
  }

  private processHandlers(handlers : (RequestHandler | [new () => any, keyof any])[]){
    return handlers.map((handler, index) => {
      if(index === handlers.length - 1 && handler instanceof Array){
        return this.handlerWrapper(getController(handler[0], handler[1]))
      }else {
        if(handler instanceof Array)
          throw new Error("Controller handler must be the last handler");
        return this.handlerWrapper(handler);
      }
    })
  }
  
  public get<T>(path: string, ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    const newHandlers = this.processHandlers(handlers);
    this.router.get(path, ...newHandlers);
  }

  public post<T>(path: string, ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    const newHandlers = this.processHandlers(handlers);
    this.router.post(path, ...newHandlers);
  }

  public put<T>(path: string, ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    const newHandlers = this.processHandlers(handlers);
    this.router.put(path, ...newHandlers);
  }

  public delete<T>(path: string, ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    const newHandlers = this.processHandlers(handlers);
    this.router.delete(path, ...newHandlers);
  }

  public patch<T>(path: string, ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    const newHandlers = this.processHandlers(handlers);
    this.router.patch(path, ...newHandlers);
  }
  
  public use(path: string, ...handlers : RequestHandler[]){
    this.router.use(path, ...handlers);
  }

  public build(){
    return {router : this.router, path: this.path};
  }
}