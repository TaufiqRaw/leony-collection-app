import { Route } from "../../utils/classes/route.util";
import { mustLoginMiddleware } from "../auth-n/middlewares/must-login.middleware";
import { DashboardController } from "./dashboard.controller";

const route = new Route("/dashboard");

route.use(mustLoginMiddleware);

route.get("/", [DashboardController, "index"]);

route.post("/add-production-log", [DashboardController, "addProductionLog"]);

export default route.build();