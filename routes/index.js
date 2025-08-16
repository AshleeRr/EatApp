import ClientRoutes from "./client/ClientRoutes.js";
import AuthenticationRoutes from "./authentification/AuthenticationRoutes.js";
import DeliveryRoutes from "./delivery/DeliveryRoutes.js";
import StoreRoutes from "./stores/indexStoreRoutes.js";
import AdminRoutes from "./admin/homeRoutes.js";
import DirectionsRoutes from "./client/DirectionsRoutes.js";
//midlewares
import setLayout from "../middlewares/setLayout.js";
import isAuth from "../middlewares/isAuthenticated.js";
//import loadUser from "../middlewares/loadUserLogin.js";

export const routes = (app) => {
  app.use(AuthenticationRoutes);

  app.use("/client", isAuth, setLayout("ClientLayout"), ClientRoutes);
  
  app.use("/client/directions", isAuth, setLayout("ClientLayout"), DirectionsRoutes);

  app.use("/store", isAuth, setLayout("StoreLayout"), StoreRoutes);

  app.use("/delivery", isAuth, setLayout("DeliveryLayout"), DeliveryRoutes);

  app.use("/admin", isAuth, setLayout("AdminLayout"), AdminRoutes);
};
