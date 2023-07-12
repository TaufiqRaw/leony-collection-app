import httpContext from "express-http-context"
import { InstanceMap } from "./instance-map.util";
import { Class } from "../types/class.type";

export function getService<T>(service: new () => T): T{
  let serviceMap : InstanceMap = httpContext.get("service-map");

  const serviceInstance = serviceMap.get(service);
  
  if(!serviceInstance) serviceMap.add(new service());
  
  return serviceMap.get(service) as T;
}