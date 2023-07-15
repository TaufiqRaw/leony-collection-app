import { NextFunction, Request, Response } from "express";

export function mustLoginMiddleware(req : Request, res: Response, next : NextFunction) {
  if (req.session.user) {
    res.locals.user = req.session.user;
    return next();
  } else {
    res.redirect('/auth/login');
  }
}