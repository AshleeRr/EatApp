import context from "../config/context/AppContext.js";

export function GetIndex(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

