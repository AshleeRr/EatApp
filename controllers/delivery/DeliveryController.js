import context from "../../config/context/AppContext.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";
import { HandError } from "../../utils/handlers/handlerError.js";
import {
  DeliveryRepository,
  StoreRepository,
} from "../../repositories/index.js";
import {Op} from "sequelize";

export async function GetIndex(req, res, next) {
  try {
    req.user = req.session.user;
    const orders = await context.Pedido.findAll({
      where: { deliveryId: req.user.id },
      order: [["createdAt", "DESC"]],
      include: [
        { model: context.Comercio, as: "comercio" },
        { model: context.DetallePedido, as: "detalles" }
      ]
    });

    const ordersList = orders.map((o) => {
      const plain = o.get({ plain: true });
      // sumar todas las cantidades de los detalles
      plain.productsCount = plain.detalles.reduce(
        (acc, d) => acc + d.cantidad, 
        0
      );
      return plain;
    });

    res.render("deliveryViews/home", {
      "page-title": "Home",
      ordersList,
      hasOrders: ordersList.length > 0,
    });
  } catch (error) {
    req.flash("errors", `An error ocurred while loading the orders ${error}`);
    res.redirect("/delivery/home");
  }
}


export async function GetOrderDetails(req, res) {
  try {
    req.user = req.session.user;
    const pedidoId = req.params.id;

    const pedido = await context.Pedido.findOne({
      where: { id: pedidoId, deliveryId: req.user.id }, 
      include: [
        { model: context.Comercio, as: "comercio" },
        {
          model: context.DetallePedido,
          as: "detalles", 
          include: [
            { model: context.Producto, as: "producto" } 
          ],
        },
      ],
    });

    if (!pedido) {
      req.flash("errors", "Pedido no encontrado");
      return res.redirect("/delivery/home");
    }

    res.render("deliveryViews/details", {
      "page-title": "Order Details",
      pedido: pedido.get({ plain: true }),
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", `Error loading order details ${error}`);
    res.redirect("/delivery/home");
  }
}

export async function GetProfile(req, res, next){
  try{
    req.user = req.session.user;
    const userCheck = await context.Delivery.findOne({ where : {userId: req.user.id} });
    const userEmail = await context.User.findOne({ where : {id: req.user.id} });

    if(!userCheck){
      return res.redirect("/delivery/home");
    }

    const user = userCheck.dataValues;
    const uEmail = userEmail.dataValues;
    res.render("deliveryViews/profile", {
      uEmail,
      user,
      "page-title": "My Account", 
    });
  }catch(error){
    console.log(error);
    req.flash("errors", "An error ocurred loading your profile");
    return res.redirect("/delivery/home");
  }  
}

export async function PostProfile(req, res, next){
  try{
    req.user = req.session.user;
    const { FirstName, LastName, UserName, Email, PhoneNumber} = req.body;
    const ProfilePhoto = req.file;
    let LogoPath = null;

    const userCheck = await context.Delivery.findOne({ where : {userId: req.user.id} });

    const existsUser = await context.User.findOne({where: {
      [Op.and]: [{email: Email}, {id: {[Op.ne]: req.user.id}}] 
      }
    });

    if(!userCheck){
      return res.redirect("/delivery/home");
    }

    if(ProfilePhoto){
      LogoPath = "\\" + path.relative("public", ProfilePhoto.path)
    }else{
      LogoPath = userCheck.ProfilePhoto;
    }

    if(existsUser){
      req.flash("errors", "This email is already taken");
      return res.redirect("/delivery/profile");
    }else{
      await context.User.update({
        email: Email
      },{where:{id: req.user.id}});
    }
      await context.Delivery.update({
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
      },{where:{userId: req.user.id}});

      req.flash("success", "Your profile was updated successfully");
      res.redirect("/delivery/home");
  }catch(error){
    console.log(error);
    req.flash("errors", `An error ocurred update your profile ${error}`);
    return res.redirect("/delivery/home");
  }
}

export const completeOrder = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.deliveryId !== req.user.deliveryId)
    HandError(403, "No tiene permisos para completar este pedido");

  if (pedido.estado !== "en proceso")
    HandError(400, "Solo se pueden completar pedidos que están en proceso");

  const transaction = await StoreRepository.OrderRepository.startTransaction();

  await StoreRepository.OrderRepository.update(
    pedidoId,
    { estado: "completado", fechaCompletado: new Date() },
    { transaction }
  );

  await DeliveryRepository.updateDeliveryStatus(
    pedido.deliveryId,
    "disponible",
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await StoreRepository.OrderRepository.getOrderById(
    pedidoId
  );

  if (!pedidoActualizado) HandError(400, "El pedido no ha podido ser asignado");

  req.flash("success", "El pedido ha sido completado");

  res.render("ruta/ruta del delivery", {
    titutlo: "lo deje asi por que no se cual es la ruta del delivery",
  });
});

export const unassignDelivery = HandControllersAsync(async (req, res) => {
  const pedidoId = req.params.id;

  const pedido = await StoreRepository.OrderRepository.getOrderById(pedidoId);

  if (!pedido) HandError(404, "Pedido no encontrado");

  if (pedido.comercioId !== req.user.comercioId)
    HandError(403, "No tiene permisos para modificar este pedido");

  if (!pedido.deliveryId || pedido.estado !== "en proceso")
    HandError(400, "Solo se puede desasignar delivery de pedidos en proceso");

  const transaction = await StoreRepository.OrderRepository.startTransaction();

  await DeliveryRepository.updateDeliveryStatus(
    pedido.deliveryId,
    "disponible",
    { transaction }
  );

  await StoreRepository.OrderRepository.update(
    pedidoId,
    { deliveryId: null, estado: "pendiente" },
    { transaction }
  );

  await transaction.commit();

  const pedidoActualizado = await StoreRepository.OrderRepository.getOrderById(
    pedidoId
  );
  if (!pedidoActualizado) HandError(400, "El pedido no ha podido ser asignado");

  res.render("ruta/ruta del delivery", {
    titutlo: "lo deje asi por que no se cual es la ruta del delivery",
  });
});
