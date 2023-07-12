import { Router } from "express";
import staticRoute from "./modules/static/static.route";
import userRoutes from "./modules/user/user.route";

const routes = Router()

const route=[ 
  userRoutes,
  staticRoute
].forEach(route => routes.use(route.path, route.router))

export default routes;
