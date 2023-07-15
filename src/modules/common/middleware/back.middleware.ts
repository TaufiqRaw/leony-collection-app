import { NextFunction, Request, Response } from "express";

declare module 'express-session' {
  interface SessionData {
    prevPath: string;
    prevPrevPath: string;
  }
}

declare global {
  namespace Express {
    export interface Request {
      prevPath: string;
      prevPrevPath: string;
    }
    export interface Response {
      back(): void;
    }
  }
}

var r = require('http').ServerResponse;

r.prototype.back = function() {
  var req = this.req;
  var redirect = req.prevPath;
  if (req.prevPath && req.path === req.prevPath) {
    redirect = req.prevPrevPath && req.path !== req.prevPrevPath
      ? req.prevPrevPath
      : '/';
  }
  return this.redirect(redirect);
};


export function back(_defaultPath = '/') {
  let defaultPath = _defaultPath;

  return function(req : Request, res : Response, next : NextFunction) {
    if (!req.session) {
      return next(new Error('sessions are required for `express-back`'));
    }
    var _end = res.end;
    var currentPath = req.path;
    var session = req.session;
    req.prevPrevPath = session.prevPrevPath || defaultPath;
    req.prevPath = session.prevPath || defaultPath;

    // @ts-ignore
    res.end = function(chunk, encoding, cb) {
      session.prevPrevPath = session.prevPath;
      session.prevPath = currentPath;
      _end.call(res, chunk, encoding);
    };
    next();
  }
}
