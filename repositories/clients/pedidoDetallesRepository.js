import context from "../../config/context/AppContext.js";
import GenericRepository from "../GenericRepository.js";

//handlers
import { HandRepositoriesAsync } from "../../utils/handlers/handlerAsync.js";

//needed repos
import config from "../admin/configRepository.js";

class OrderDetailsRepository extends GenericRepository {
  constructor() {
    super(context.DetallePedido);
  }

  calcularFactura = HandRepositoriesAsync(async (items, itbisPercent) => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.precio * item.cantidad,
      0
    );
    const itbis = subtotal * (itbisPercent / 100);
    const total = subtotal + itbis;
    return { subtotal, itbis, total };
  });
  GenerarFactura = HandRepositoriesAsync(async (carrito) => {
    let items = 0;
    const productos = [];

    for (const item of carrito) {
      const producto = await super.findOne(item.idProducto);

      if (producto) {
        const itemTotal = producto.precio * item.cantidad;
        items += itemTotal;

        productos.push({
          ...producto,
          cantidad: item.cantidad,
          total: itemTotal,
        });
      }
    }
    const itbisPercent = await config.getItbis();

    const { subtotal, itbis, total } = this.calcularFactura(
      productos,
      itbisPercent
    );
    return {
      factura: {
        items,
        productos,
        subtotal,
        itbisPercent,
        itbis,
        total,
      },
    };
  });
}

export default new OrderDetailsRepository();
