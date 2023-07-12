import { Server } from "./utils/server";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config"
import Express from "express";
import config from "./database/mikro-orm.config";
import path from "path";
import routes from "./routes";

new Server({
  port: process.env.PORT || 3000,
  plugins: [
    cookieParser(),
    cors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-Access-Token', 'X-Key', 'Cookies', 'Cache-Control', 'Set-Cookie'],
      credentials: true
    }),
    helmet({
      crossOriginResourcePolicy: false,
    }),
    Express.urlencoded({extended: true}),
    Express.static(path.join(__dirname, "../public"))
  ],
  config : {
    "view engine" : "pug",
    "views" : path.join(__dirname, "../views"),
  },
  routes : [routes],
  databaseConfig : config
}).run();