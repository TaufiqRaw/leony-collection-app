import { RequestHandler } from "express";
import httpContext from "express-http-context";

export function getController<T>(controller : new () => T, key : keyof T):RequestHandler{
  return (req,res)=>{
    let controllerInstance = httpContext.get("controller-map").get(controller) as T | undefined;
    if(!controllerInstance){
      controllerInstance = new controller();
      httpContext.get("controller-map").add(controllerInstance);
    }

    //@ts-ignore
    const func = controllerInstance[key].bind(controllerInstance)
    return func(req,res);
  };
}