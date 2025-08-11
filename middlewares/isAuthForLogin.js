export default function isAuthForLogin(req, res, next) {
    if(req.session.isAuthenticated){
        res.redirect("/home") 
    }
   // req.user = req.session.user;
    next(); 
}
// si el usuario incio sesion y quiere ir al log in que redireccione al home
// y que tenga que hacer log out para ir al log in
