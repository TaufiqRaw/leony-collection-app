import { Router } from "express";
import staticRoute from "./modules/dashboard/dashboard.route";
import authNRoute from "./modules/auth-n/auth-n.route";
import userRoute from "./modules/user/user.route";
import adminRoute from "./modules/admin/admin.route";


export const routes=[ 
  authNRoute,
  staticRoute, 
  adminRoute,
  {router : Router().get("/", (req, res) => res.redirect("/dashboard")), path : "/" },
]
