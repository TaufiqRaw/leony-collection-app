import { Server } from "./utils/classes/server";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config"
import Express from "express";
import config from "./database/mikro-orm.config";
import path from "path";
import {routes} from "./routes";
import session from "express-session"
import flash from "connect-flash"
import "./types/express.type"
import moment from "moment"
import { back } from "./modules/common/middleware/back.middleware";
import methodOverride from "method-override"

new Server({
  port: process.env.PORT || 3000,
  plugins: [
    cookieParser(),
    // cors({
    //   origin: true,
    //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
    //   allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Access-Token', 'X-Key', 'Cookies', 'Cache-Control', 'Set-Cookie'],
    //   credentials: true
    // }),
    // helmet({
    //   crossOriginResourcePolicy: false,
    // }),
    Express.urlencoded({extended: true}),
    Express.static(path.join(__dirname, "../public")),
    methodOverride('_method'),
    session({
      secret : "secret",
      resave : false,
      saveUninitialized : false,
      cookie: { 
        secure: false, // This will only work if you have https enabled!
        maxAge: 3600 * 1000 * 24 * 1 // 1 days
      } 
    }),
    flash(),
    back("/dashboard")
  ],
  config : {
    "view engine" : "pug",
    "views" : path.join(__dirname, "../src_frontend/pug"),
  },
  onReq : (req, res) => {
    res.locals.error = req.flash("error")
    res.locals.dateify = (time: Date)=>moment(time).utcOffset(7)
    res.locals.success = req.flash("success")
  },
  routes : [...routes],
  databaseConfig : config
}).run();