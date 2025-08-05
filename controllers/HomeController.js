export function GetIndex(req, res, next){
    res.render("home/index", {"page-title": "Home/Dashboard"});
}