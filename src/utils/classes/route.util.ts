import { NextFunction, Request, Response, Router } from "express";
import { getController } from "../get-controller.util";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export class Route {
  private router = Router();

  constructor(private readonly path : string){}

  private handlerWrapper(requestHandler : RequestHandler){
    return (req : Request, res : Response,next : NextFunction)=>{
      Promise.resolve(requestHandler(req,res,next)).catch((err)=>{
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

  public chain(path : string){
    return new ChainableRoute(this, path);
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
  
  public use(...handlers : RequestHandler[]){
    this.router.use(...handlers);
  }

  public build(){
    return {router : this.router, path: this.path};
  }
}

class ChainableRoute {
  constructor(
    private readonly parentRoute : Route, 
    private readonly path : string){}

  public get<T>(...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public get<T>(path : string, ...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public get<T>(pathOrHandler : string | (RequestHandler | [new () => T, keyof T]), ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    if(typeof pathOrHandler === "string")
      this.parentRoute.get(this.path + pathOrHandler, ...handlers);
    else
      this.parentRoute.get(this.path, pathOrHandler, ...handlers)
    return this;
  }

  public post<T>(...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public post<T>(path : string, ...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public post<T>(pathOrHandler : string | (RequestHandler | [new () => T, keyof T]), ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    if(typeof pathOrHandler === "string")
      this.parentRoute.post(this.path + pathOrHandler, ...handlers);
    else
      this.parentRoute.post(this.path, pathOrHandler, ...handlers)
    return this;
  }

  public put<T>(...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public put<T>(path : string, ...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public put<T>(pathOrHandler : string | (RequestHandler | [new () => T, keyof T]), ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    if(typeof pathOrHandler === "string")
      this.parentRoute.put(this.path + pathOrHandler, ...handlers);
    else
      this.parentRoute.put(this.path, pathOrHandler, ...handlers)
    return this;
  }

  public delete<T>(...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public delete<T>(path : string, ...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public delete<T>(pathOrHandler : string | (RequestHandler | [new () => T, keyof T]), ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    if(typeof pathOrHandler === "string")
      this.parentRoute.delete(this.path + pathOrHandler, ...handlers);
    else
      this.parentRoute.delete(this.path, pathOrHandler, ...handlers)
    return this;
  }

  public patch<T>(...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public patch<T>(path : string, ...handlers : (RequestHandler | [new () => T, keyof T])[]) : ChainableRoute
  public patch<T>(pathOrHandler : string | (RequestHandler | [new () => T, keyof T]), ...handlers : (RequestHandler | [new () => T, keyof T])[]){
    if(typeof pathOrHandler === "string")
      this.parentRoute.patch(this.path + pathOrHandler, ...handlers);
    else
      this.parentRoute.patch(this.path, pathOrHandler, ...handlers)
    return this;
  }
}