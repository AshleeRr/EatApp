import ClientRoutes from "./ClientRoutes.js";
import AuthenticationRoutes from "./AuthenticationRoutes.js";
import DeliveryRoutes from "./DeliveryRoutes.js";
import StoreRoutes from "./stores/indexStoreRoutes.js";
import AdminRoutes from "./admin/homeRoutes.js";

//midlewares
import setLayout from "../middlewares/setLayout.js";
import isAuth from "../middlewares/isAuthenticated.js";
//import loadUser from "../middlewares/loadUserLogin.js";

export const routes = (app) => {
  app.use(AuthenticationRoutes);

  app.use("/client", isAuth, setLayout("ClientLayout"), ClientRoutes);

  app.use("/store", isAuth, setLayout("StoreLayout"), StoreRoutes);

  app.use("/delivery", isAuth, setLayout("DeliveryLayout"), DeliveryRoutes);

  app.use("/admin", isAuth, setLayout("AdminLayout"), AdminRoutes);
};
