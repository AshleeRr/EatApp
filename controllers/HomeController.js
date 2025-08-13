import context from "../config/context/AppContext.js";

export async function GetIndex(req, res, next){

  //cliente
  /*
  

  //
*/
  const role = req.user.role;
  try{
    switch(role){
      case "client": return res.render(
        "clientViews/home", { 
        "page-title": "Home/Client", 
        layout: "ClientLayout",
       /* businessesList: businesses,
        hasbusinesses: businesses.length > 0,
        businessTypeList: businessTypes,
        hasBusinessTypes: businessTypes.length > 0 */
      });
      case "delivery": return res.render("deliveryViews/home", { "page-title": "Home/Delivery", layout: "DeliveryLayout" });
      case "store": return res.render("storeViews/home", { "page-title": "Home/Store", layout: "StoreLayout" });
      case "admin": return res.render("adminViews/home", { "page-title": "Home/Admin", layout: "AdminLayout" });
      default: return res.redirect("/");
    }
  }catch(error){
    console.log("ha ocurrido un error", error);
    req.flash(error);
    return("/");
  }
}