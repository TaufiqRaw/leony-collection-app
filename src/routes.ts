import { Router } from "express";
import staticRoute from "./modules/dashboard/dashboard.route";
import authNRoute from "./modules/auth-n/auth-n.route";
import userRoute from "./modules/user/user.route";

export const routes=[ 
  authNRoute,
  staticRoute, 
]
