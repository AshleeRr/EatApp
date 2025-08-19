import Handlebars from "handlebars";

Handlebars.registerHelper("isInCart", function (productId, carrito) {
  if (!carrito || !Array.isArray(carrito)) return false;

  return carrito.some((item) => {
    if (item.producto) {
      return item.producto.id === productId;
    }
    return item.id === productId;
  });
});

export default function isInCart(productId, carrito) {
  console.log("carrito antes :>> ", carrito);
  if (!carrito || !Array.isArray(carrito)) return false;
  console.log("carrito despues :>> ", carrito);
  return carrito.some((item) => {
    return item.producto && item.producto.id === productId;
  });
}
