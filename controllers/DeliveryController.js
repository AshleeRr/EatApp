import context from "../config/context/AppContext.js";

export function GetIndex(req, res, next){
    res.render("delivery/home", {"page-title": "Home/Delivery", layout:"DeliveryLayout"});
}