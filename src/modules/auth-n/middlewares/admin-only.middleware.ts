import { NextFunction, Request, Response } from "express";

export function adminOnlyMiddleware(req : Request, res: Response, next : NextFunction) {
  if (req.session.user && req.session.user.isAdmin) {
    res.locals.user = req.session.user;
    return next();
  } else {
    res.redirect('/auth/logout');
  }
}