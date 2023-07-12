import { Route } from "@/utils/route.util";

const staticRoute = new Route("/");

staticRoute.get("/", (req, res) => {
  res.render("welcome")
});

export default staticRoute.build();