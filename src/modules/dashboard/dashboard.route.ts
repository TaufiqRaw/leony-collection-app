import { Route } from "@/utils/classes/route.util";
import { mustLoginMiddleware } from "../auth-n/middlewares/must-login.middleware";

const staticRoute = new Route("/dashboard");

staticRoute.use(mustLoginMiddleware);

staticRoute.get("/", (req, res) => {
  res.render("user/dashboard")
});

export default staticRoute.build();