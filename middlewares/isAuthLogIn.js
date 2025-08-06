export default function isAuthenticated(req, res, next){
    if(req.session.isAuthenticated){
        res.redirect("/home") // que redireccione al home de cada rol
    }
    next(); 
}