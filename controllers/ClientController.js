import context from "../config/context/AppContext.js";
import {Op} from "sequelize";

export async function GetHome(req,res,next){

  //console.log("query", req.query)
  const typeFilter = req.query.typeFilter || '';
  const typeBtn = req.query.Type || '';
  const result = {};

  //console.log("filter", typeFilter);
  if(typeFilter.trim()){  
    result.nombre = {[Op.like]: `%${typeFilter}%`};
  }

  if(typeBtn.trim()){
    result.nombre = {[Op.eq]: typeBtn};
  }
  const businessTypes = await context.TipoComercio.findAll({where: result});
  
  //const businessTypesPlain = businessTypes.map((bt) => bt.get({plain: true}));
  //const businessesPlain = businesses.map((b)=> b.get({plain: true}));

    return res.render(
        "clientViews/home", { 
        "page-title": "Home/Client", 
        layout: "ClientLayout",
      //  businessesList: businesses,
        //hasbusinesses: businesses.length > 0,
        businessTypeList: businessTypes.map(bt => bt.get({plain:true})),
        hasBusinessTypes: businessTypes.length > 0 
      });
}

export function GetProfile(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

export function GetDirections(req, res, next){
    res.render("client/home", {"page-title": "Home/Client", layout:"ClientLayout"});
}

