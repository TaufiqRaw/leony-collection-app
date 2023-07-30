import { Route } from "@/utils/classes/route.util";

const route = new Route("/admin");

route.get("/", (req, res) => {
  res.render("admin/dashboard")
});