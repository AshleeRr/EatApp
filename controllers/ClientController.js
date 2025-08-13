import context from "../config/context/AppContext.js";

export function GetProfile(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

export function GetDirections(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

