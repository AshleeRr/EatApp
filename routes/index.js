import ClientRoutes from "./clients/index.js";
import AuthenticationRoutes from "./authentification/AuthenticationRoutes.js";
import DeliveryRoutes from "./delivery/DeliveryRoutes.js";
import StoreRoutes from "./stores/indexStoreRoutes.js";
import AdminRoutes from "./admin/indexAdminRoutes.js";

//midlewares
import setLayout from "../middlewares/setLayout.js";
import isAuth from "../middlewares/isAuthenticated.js";
import errorHandler from "../middlewares/errorHandler.js";

export const routes = (app) => {
  app.use(errorHandler);

  app.use(AuthenticationRoutes);

  app.use("/client", isAuth, setLayout("ClientLayout"), ClientRoutes);

  app.use("/store", isAuth, setLayout("StoreLayout"), StoreRoutes);

  app.use("/delivery", isAuth, setLayout("DeliveryLayout"), DeliveryRoutes);

  app.use("/admin", isAuth, setLayout("AdminLayout"), AdminRoutes);
};
