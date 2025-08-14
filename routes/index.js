import HomeRoute from "./HomeRoutes.js";
import ClientRoutes from "./ClientRoutes.js";
import AuthenticationRoutes from "./AuthenticationRoutes.js";
import DeliveryRoutes from "./DeliveryRoutes.js";
import StoreRoutes from "./WholeStoreRoutes.js";

//midlewares
import setLayout from "../middlewares/setLayout.js";
import isAuth from "../middlewares/isAuthenticated.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import loadUser from "../middlewares/loadUserLogin.js";

export const routes = (app) => {
  app.use(AuthenticationRoutes);

  app.use("/", isAuthenticated, loadUser, HomeRoute);

  app.use("/client", isAuth, setLayout("ClientLayout"), ClientRoutes);

  app.use("/store", isAuth, setLayout("StoreLayout"), StoreRoutes);

  app.use("/delivery", isAuth, setLayout("DeliveryLayout"), DeliveryRoutes);
};
