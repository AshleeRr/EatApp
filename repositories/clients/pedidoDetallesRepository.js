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
  calcularFactura = HandRepositoriesAsync(async (items, porciento) => {
    const subtotal = items.reduce((acc, item) => acc + item.precio, 0);
    const itbis = (subtotal * porciento) / 100;
    const total = subtotal + itbis;
    return { subtotal, itbis, total };
  });

  GenerarFactura = HandRepositoriesAsync(async (carrito) => {
    let items = 0;
    const productos = [];

    for (const item of carrito) {
      const producto = item.producto;

      if (producto) {
        const itemTotal = producto.precio;
        items += itemTotal;

        productos.push({
          ...(producto.toJSON ? producto.toJSON() : producto),
          total: itemTotal,
        });
      }
    }

    const itbisConfig = await config.getItbis();

    const porciento = itbisConfig.dataValues
      ? itbisConfig.dataValues.value
      : itbisConfig.value || itbisConfig;

    console.log("itbisPercent extraído:", porciento);

    const { subtotal, itbis, total } = await this.calcularFactura(
      productos,
      porciento
    );

    return {
      factura: {
        items,
        productos,
        subtotal,
        porciento: porciento,
        itbis,
        total,
      },
    };
  });
}

export default new OrderDetailsRepository();
