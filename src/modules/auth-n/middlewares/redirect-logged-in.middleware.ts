import { NextFunction, Request, Response } from "express";

export function redirectLoggedInMiddleware(req : Request, res : Response, next : NextFunction) {
  if (req.session.user) {
    return res.back();
  }
  next();
}