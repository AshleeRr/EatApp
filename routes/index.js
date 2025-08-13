import HomeRoute from "./HomeRoutes.js";
import ClientRoutes from "./ClientRoutes.js";
import StoreRoutes from "./StoreRoutes.js";
import AuthenticationRoutes from "./AuthenticationRoutes.js";
import DeliveryRoutes from "./DeliveryRoutes.js";

export const routes = (app) => {
  app.use(AuthenticationRoutes);
  app.use("/", HomeRoute);
  app.use("/client", ClientRoutes);
  app.use("/store", StoreRoutes);
  app.use("/delivery", DeliveryRoutes);
};
