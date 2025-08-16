export default function isAuthForLogin(req, res, next) {
    req.user = req.session.user;
    if(req.session.isAuthenticated){
        switch(req.user.role){
            case "client": res.redirect("/client/home"); break;
            case "admin": res.redirect("/admin/home"); break;
            case "store": res.redirect("/store/index"); break;
            case "delivery": res.redirect("/delivery/home"); break;
            default:
                req.flash(
                    "errors",
                    "That role does not exist yet. Contact and admin"
                );
                return res.redirect("/");
        }
        res.redirect("/home") 
    }
   
    next(); 
}
// si el usuario incio sesion y quiere ir al log in que redireccione al home
// y que tenga que hacer log out para ir al log in
