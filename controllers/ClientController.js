import context from "../context/AppContext.js";
export function GetIndex(req, res, next){
    res.render("client/index", {"page-title": "Home/Client"});
}

