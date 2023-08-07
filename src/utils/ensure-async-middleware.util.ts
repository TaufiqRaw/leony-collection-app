import { NextFunction, Request, Response } from "express";
import { AsyncResource } from "async_hooks";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;

export function ensureAsyncMiddleware(middleware: RequestHandler) {
  return (req : Request, res : Response, next : NextFunction) => middleware(req, res, AsyncResource.bind(next))
} 