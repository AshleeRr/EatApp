import context from "../../config/context/AppContext.js";
import {Op} from "sequelize";

export async function GetAdresses(req, res) {
  try {
    const adresses = await context.Direccion.findAll({
      where: { usuarioId: req.session.user.id }
    });

    const adressesPlain = adresses.map((a) => a.get({plain:true}));

    res.render("clientViews/adressesViews/home", {
      pageTitle: "My Adresses",
      adressesList: adressesPlain,
      hasAdresses: adressesPlain.length > 0
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", "Error loading adresses");
    res.redirect("/client/home");
  }
}

export async function GetCreateAdress(req, res) {
  res.render("clientViews/adressesViews/create", {
    pageTitle: "Add Adress",
    editMode: false
  });
}

export async function PostCreateAdress(req, res) {
  try {
    req.user = req.session.user;
    const { Name, Description } = req.body;

    //donde haya una direccion con ese nombre o desccripcion y mismo userid, que diga que edite y redireccione
    const existingAddress = await context.Direccion.findOne({
      where: {
        usuarioId: req.user.id,
        [Op.or]: [
          { nombre: Name },
          { descripcion: Description }
        ]
      }
    });
    
    if(existingAddress){
      req.flash("errors", "You already have a direction with this informations");
      return res.redirect("/client/directions/home");
    }

    await context.Direccion.create({
      nombre: Name,
      descripcion: Description,
      usuarioId: req.user.id
    });

    req.flash("success", "Adress created successfully");
    res.redirect("/client/directions/home");

  } catch (error) {
    console.log(error);
    req.flash("errors", "Error creating adress");
    res.redirect("/client/directions/create"); 
  }
}

export async function GetEditAdress(req, res) {
  try {
    req.user = req.session.user;
    const id = req.params.adressId;
    const directionResult = await context.Direccion.findOne({
      where: {id, usuarioId: req.user.id}
    });

    if (!directionResult) {
      req.flash("errors", "Adress not found. Try again or contact and Admin");
      return res.redirect("/client/directions/home");
    }
    const adress = directionResult.dataValues;
    const adressResult = await context.Direccion.findAll({
      where:{usuarioId: req.user.id}
    });
    const adressList = adressResult.map((a) => a.dataValues);
    res.render("clientViews/adressesViews/create", {
      pageTitle: "Edit my Direction",
      directions: adressList,
      hasDirections: adressList.length > 0, 
      editMode: true,
      adress
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", "Error loading adress");
    res.redirect("/client/directions/home");
  }
}

export async function PostEditAdress(req, res) {
  try {
    req.user = req.session.user;
    const { Name, Description, AdressId } = req.body;

    const directionResult = await context.Direccion.findOne({
      where: {id: AdressId, usuarioId: req.user.id}
    });

    if(!directionResult){
      req.flash("An error ocurred trying to access this direction"); //borrar dep
      return res.redirect(
        "/client/directions/home");
    }
    await context.Direccion.update({ 
      nombre: Name, 
      descripcion: Description 
    },{ where: { id: AdressId } }
    );

    req.flash("success", "Adress updated successfully");
    res.redirect("/client/directions/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", "Error updating adress");
    res.redirect("/client/directions/home");
  }
}

export async function Delete(req, res) {
  try {
    req.user = req.session.user;
    const id = req.body.AdressId;

    const direction = await context.Direccion.findOne({
      where: { id, usuarioId: req.user.id },
    });

    if(!direction){
      req.flash("An error ocurred trying to delete this direction"); 
      return res.redirect("/client/directions/home");
    }

    await context.Direccion.destroy({
      where: { id, usuarioId: req.user.id }
    });

    req.flash("success", "Adress deleted successfully");
    res.redirect("/client/directions/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", "Error deleting adress");
    res.redirect("/client/directions/home");
  }
}

