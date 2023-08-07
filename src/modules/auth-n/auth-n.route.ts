import { Route } from "../../utils/classes/route.util";
import { AuthNController } from "./auth-n.controller";
import { redirectLoggedInMiddleware } from "./middlewares/redirect-logged-in.middleware";

const route = new Route("/auth")

route.chain("/login")
  .get(redirectLoggedInMiddleware,[AuthNController, "loginPage"])
  .post([AuthNController, "login"])

route.get("/logout", [AuthNController, "logout"])

export default route.build();