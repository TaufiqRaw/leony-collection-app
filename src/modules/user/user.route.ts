import { getController } from "../../utils/get-controller.util";
import { Route } from "../../utils/classes/route.util";
import { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";

const route = new Route("/user");

route.get("/", [UserController, "index"]);

export default route.build();