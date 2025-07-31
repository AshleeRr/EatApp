export function GetLogIn(req, res, next){
    res.render("AuthenticationViews/login", {"page-title": "Log In"});
}