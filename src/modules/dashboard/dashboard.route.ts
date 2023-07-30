import { Route } from "@/utils/classes/route.util";
import { mustLoginMiddleware } from "../auth-n/middlewares/must-login.middleware";

const route = new Route("/dashboard");

route.use(mustLoginMiddleware);

route.get("/", (req, res) => {
  res.render("user/dashboard")
});

export default route.build();