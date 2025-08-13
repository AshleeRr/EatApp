import context from "../config/context/AppContext.js";

export function GetHome(req, res, next){
    return res.render("deliveryViews/home", { "page-title": "Home/Delivery", layout: "DeliveryLayout" });
}