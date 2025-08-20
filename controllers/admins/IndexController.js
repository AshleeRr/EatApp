import admin from "../../models/admin.js";
import {
  StoreRepository,
  ClientRepository,
  AdminRepository,
  DeliveryRepository,
} from "../../repositories/index.js";

import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

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
  const productosTotales =
    await StoreRepository.ProductsRepository.getAllProducts();

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
    productos: productosTotales.length,
    user,
    isAdmin: true,
  });
});

export const ClientsList = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const clientsdata = await ClientRepository.clientRepository.findAllOrders();
  const clients = clientsdata.map((a) => a.dataValues);

  const clientes = clients.map((cliente) => {
    const cantidad = cliente.Pedidos?.length || 0;

    return {
      id: cliente.id,
      nombre: cliente.name,
      apellido: cliente.lastName,
      telefono: cliente.phoneNumber,
      correo: cliente.User?.email || "No disponible",
      cantidad,
      hasPedidos: cantidad > 0,
      isActive: cliente.User?.isActive || false,
      userId: cliente.userId,
      fechaRegistro: cliente.createdAt,
    };
  });

  return res.render(`adminViews/ClientList`, {
    title: "Client DashBoard",
    user,
    hasClients: clientes.length > 0,
    clients: clientes,
    total: clientes.length,
    clientesActivos: clientes.filter((c) => c.isActive).length,
    clientesInactivos: clientes.filter((c) => !c.isActive).length,
  });
});

export const deliveriesList = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  const deliveriesdata = await DeliveryRepository.findAll();
  const deliveries = deliveriesdata.map((a) => a.dataValues);
  const deliveriesProcessed = deliveries.map((delivery) => {
    const cantidadEntregas = delivery.Pedidos?.length || 0;

    console.log("delivery :>> ", delivery);
    return {
      id: delivery.id,
      nombre: delivery.name,
      apellido: delivery.lastName,
      nombreCompleto: `${delivery.name} ${delivery.lastName}`,
      telefono: delivery.phoneNumber,
      correo: delivery.User?.email || "No disponible",
      cantidadEntregas,
      tieneEntregas: cantidadEntregas > 0,
      isActive: delivery.User?.isActive || false,
      userId: delivery.userId,
      fechaRegistro: delivery.createdAt,
      estado: delivery.estado,
    };
  });

  return res.render(`adminViews/deliveryList`, {
    title: "Delivery DashBoard",
    user,
    hasDeliveries: deliveriesProcessed.length > 0,
    deliveries: deliveriesProcessed,
    totalDeliveries: deliveriesProcessed.length,
    deliveriesActivos: deliveriesProcessed.filter((d) => d.isActive).length,
    deliveriesInactivos: deliveriesProcessed.filter((d) => !d.isActive).length,
  });
});

export const storesList = HandControllersAsync(async (req, res) => {
  const { user } = req.session;
  const storesdata = await StoreRepository.StoreRepository.getDataStore();
  const stores = storesdata.map((a) => a.dataValues);
  const storesProcessed = stores.map((store) => {
    const cantidadPedidos = store.Pedidos?.length || 0;

    console.log("store :>> ", store);

    return {
      id: store.id,
      nombre: store.name,
      logo: store.logo || "/assets/imgs/default-store-logo.png",
      telefono: store.phoneNumber,
      correo: store.email || store.User?.email || "No disponible",
      horaApertura: store.opening || "No especificada",
      horaCierre: store.closing || "No especificada",
      cantidadPedidos,
      Pedidos: cantidadPedidos > 0,
      isActive: store.User?.isActive || false,
      userId: store.userId,
      fechaRegistro: store.createdAt,
      tipoComercio: store.tipoComercio?.nombre || "No especificado",
    };
  });

  return res.render(`adminViews/storeList`, {
    title: "Store DashBoard",
    user,
    hasStores: storesProcessed.length > 0,
    stores: storesProcessed,
    totalStores: storesProcessed.length,
    storesActivos: storesProcessed.filter((s) => s.isActive).length,
    storesInactivos: storesProcessed.filter((s) => !s.isActive).length,
  });
});

export const changeStatus = HandControllersAsync(async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;
  const usuario = await AdminRepository.userRepository.findById(id);

  if (parseInt(usuario.id) === parseInt(user.id)) {
    req.flash("errors", "No puedes desactivar el usuario logueado");
    return res.redirect("/admin/admins/home");
  }
  const update = await AdminRepository.userRepository.update(id, {
    isActive: !usuario.isActive,
  });

  if (!update) {
    req.flash(
      "errors",
      "Hubo un error tratando de cambiar el estado del usuario"
    );
  }

  req.flash(
    "success",
    `El usuario ${usuario.dataValues.userName} ha cambiado su estado`
  );

  switch (usuario.role) {
    case "client":
      return res.redirect("/admin/dashboard/clients");
    case "delivery":
      return res.redirect("/admin/dashboard/deliveries");
    case "store":
      return res.redirect("/admin/dashboard/stores");
    case "admin":
      return res.redirect("/admin/admins/home");
    default:
      return res.redirect("/admin/dashboard/home");
  }
});
