import context from "../config/context/AppContext.js";

export async function GetHome(req,res,next){

  const businesses = await context.Comercio.findAll();
  const businessTypes = await context.TipoComercio.findAll();
  
  const businessTypesPlain = businessTypes.map((bt) => bt.get({plain: true}));
  const businessesPlain = businesses.map((b)=> b.get({plain: true}));

    return res.render(
        "clientViews/home", { 
        "page-title": "Home/Client", 
        layout: "ClientLayout",
      //  businessesList: businesses,
        //hasbusinesses: businesses.length > 0,
        businessTypeList: businessTypesPlain,
        hasBusinessTypes: businessTypesPlain.length > 0 
      });
}

export function GetProfile(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

export function GetDirections(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

