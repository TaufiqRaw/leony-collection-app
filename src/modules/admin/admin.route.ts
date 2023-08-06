import { Route } from "@/utils/classes/route.util";
import multer from "multer";
import { adminOnlyMiddleware } from "../auth-n/middlewares/admin-only.middleware";
import { AdminController } from "./admin.controller";

const upload = multer({ dest: 'public/user_img' });

const route = new Route("/admin");

route.use(adminOnlyMiddleware)

route.get("/", [AdminController, "dashboard"]);

route.chain("/user")
  .get([AdminController, "user"])
  .post(upload.single('foto') ,[AdminController, "addUser"])
route.get("/user/add", [AdminController, "addUserForm"]);
route.get("/user/:id/edit", [AdminController, "editUserForm"])
route.chain("/user/:id")
  .put(upload.single('foto'), [AdminController, "editUser"])
  .delete([AdminController, "deleteUser"]);

route.chain("/produk")
  .get([AdminController, "produk"])
  .post([AdminController, "addProduk"])
route.chain("/produk/:id")
  .put([AdminController, "editProduk"])
  .delete([AdminController, "deleteProduk"]);
route.get("/produk/:id/edit", [AdminController, "editProdukForm"])
route.get("/produk/add", [AdminController, "addProdukForm"]);

route.chain("/produksi")
  .get([AdminController, "produksi"])
route.chain("/produksi/:id")
  .delete([AdminController, "deleteProduksi"])


export default route.build();