export function GetIndex(req, res, next){
    const role = req.user.role;
    switch (role) {
    case "client":
      return res.render("client/home", { "page-title": "Home/Client", layout: "ClientLayout" });

    case "delivery":
      return res.render("delivery/home", { "page-title": "Home/Delivery", layout: "DeliveryLayout" });

    case "store":
      return res.render("store/home", { "page-title": "Home/Store", layout: "StoreLayout" });

    case "admin":
      return res.render("admin/home", { "page-title": "Home/Admin", layout: "AdminLayout" });

    default:
      return res.redirect("/");
    }
}