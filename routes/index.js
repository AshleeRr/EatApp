import HomeRoute from "./HomeRoutes.js";
import ClientRoutes from "./ClientRoutes.js";
import StoreRoutes from "./StoreRoutes.js";
import AuthenticationRoutes from "./AuthenticationRoutes.js";
import DeliveryRoutes from "./DeliveryRoutes.js";
import ProductRoutes from "./ProductRoutes.js";
import CategoryRoutes from "./CategoryRoutes.js";
import PedidoRoutes from "./PedidoRoutes.js";

export const routes = (app) => {
  app.use(AuthenticationRoutes);
  app.use("/", HomeRoute);
  app.use("/client", ClientRoutes);
  app.use("/store", StoreRoutes);
  app.use("/store/product", ProductRoutes);
  app.use("/store/category", CategoryRoutes);
  app.use("/store/pedido", PedidoRoutes);
  app.use("/delivery", DeliveryRoutes);
};
