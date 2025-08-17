import {
  StoreRepository,
  ClientRepository,
  AdminRepository,
} from "../../repositories/index.js";

import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const stores = await AdminRepository.userRepository.GetUsersByRoleWithStatus(
    "store"
  );
  const clients = await AdminRepository.userRepository.GetUsersByRoleWithStatus(
    "client"
  );
  const deliveries =
    await AdminRepository.userRepository.GetUsersByRoleWithStatus("delivery");

  const totalOrders = await StoreRepository.OrderRepository.getAllOrders();
  const todayOrders = await StoreRepository.OrderRepository.getTodayOrders();

  res.render("adminViews/home", {
    title: "Admin DashBoard",
    ActiveStores: stores.activeUsers,
    InactiveStores: stores.inactiveUsers,
    ActiveClients: clients.activeUsers,
    InactiveClients: clients.inactiveUsers,
    ActiveDeliveries: deliveries.activeUsers,
    InactiveDeliveries: deliveries.inactiveUsers,
    totalOrdersCount: totalOrders.length,
    todayOrdersCount: todayOrders.length,
    user,
    isAdmin: true,
  });
});

export const UsersListByRole = (role, title) =>
  HandControllersAsync(async (req, res) => {
    console.log("role :>> ", role);

    const usersByRole = await AdminRepository.userRepository.GetUserByRole(
      role
    );

    if (!usersByRole || usersByRole.length === 0) {
      HandError(404, `No hay ${role}s registrados`);
    }

    res.render("adminViews/userList", {
      title,
      user,
      hasUsers: usersByRole.length > 0,
      users: usersByRole,
    });
  });

export const changeStatus = HandControllersAsync(async (req, res) => {
  const { id } = req.params;

  const userToUpdate = await AdminRepository.userRepository.findOne(id);

  if (!userToUpdate) {
    HandError(404, "Usuario no encontrado");
  }

  const updatedUser = await ClientRepository.update(id, !userToUpdate.isActive);

  if (!updatedUser) {
    HandError(500, "Hubo un error tratando de cambiar el estado del usuario");
  }

  req.flash("success", "The account status has been changed!!");

  res.redirect("/admin/dashboard/index");
});
