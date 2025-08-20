import context from "../../config/context/AppContext.js";
import { Op } from "sequelize";
import path from "path";
import ClientRepository from "../../repositories/clients/ClientRepository.js";
export async function GetHome(req, res, next) {
  const typeFilter = req.query.typeFilter || "";
  const result = {};
  if (typeFilter.trim()) result.nombre = { [Op.like]: `%${typeFilter}%` };

  const businessTypes = await context.TipoComercio.findAll({ where: result });
  return res.render("clientViews/home", {
    "page-title": "Home/Client",
    businessTypeList: businessTypes.map((bt) => bt.get({ plain: true })),
    hasBusinessTypes: businessTypes.length > 0,
  });
}

export async function GetStoresList(req, res, next) {
  const { user } = req.session;
  if (!user) {
    return res.redirect("/login");
  }
  const data = await ClientRepository.findOne({
    where: { userId: user.id },
  });
  const cliente = await data.dataValues;
  const { BusinessFilter, Type } = req.query;
  const result = { tipoComercioId: Type };

  try {
    if (!Type) {
      return res.redirect("/client/home");
    }
    
    if(BusinessFilter) result.nombre = {[Op.like]: `%${BusinessFilter}%`};
    const businesses = await context.Comercio.findAll({where: result});
    
    res.render("clientViews/storesList", {
      "page-title": "Stores",
      user: cliente,
      // favoritos,
      // hasFavoritos: favoritos.length > 0,
      businessesList: businesses.map((b) => b.get({ plain: true })),
      hasBusinesses: businesses.length > 0,
      quantity: businesses.length,
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", "An error ocurred while trying to bring the businesses");
    return res.render("/clientViews/home");
  }
}

export async function GetProfile(req, res, next) {
  try {
    req.user = req.session.user;
    const userCheck = await context.Client.findOne({
      where: { userId: req.user.id },
    });
    const userEmail = await context.User.findOne({
      where: { id: req.user.id },
    });

    if (!userCheck) {
      return res.redirect("/client/home");
    }

    const user = userCheck.dataValues;
    const uEmail = userEmail.dataValues;
    res.render("clientViews/profile", {
      uEmail,
      user,
      "page-title": "My Account",
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", "An error ocurred loading your profile");
    return res.redirect("/client/home");
  }
}

export async function PostProfile(req, res, next) {
  try {
    req.user = req.session.user;
    const { FirstName, LastName, UserName, Email, PhoneNumber } = req.body;
    const ProfilePhoto = req.file;
    let LogoPath = null;

    const userCheck = await context.Client.findOne({
      where: { userId: req.user.id },
    });

    const existsUser = await context.User.findOne({
      where: {
        [Op.and]: [{ email: Email }, { id: { [Op.ne]: req.user.id } }],
      },
    });

    if (!userCheck) {
      return res.redirect("/client/home");
    }

    if (ProfilePhoto) {
      LogoPath = "\\" + path.relative("public", ProfilePhoto.path);
    } else {
      LogoPath = userCheck.ProfilePhoto;
    }

    if (existsUser) {
      req.flash("errors", "This email is already taken");
      return res.redirect("/client/profile");
    } else {
      await context.User.update(
        {
          email: Email,
          userName: UserName,
        },
        { where: { id: req.user.id } }
      );
    }
    await context.Client.update(
      {
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
      },
      { where: { userId: req.user.id } }
    );

    req.flash("success", "Your profile was updated successfully");
    res.redirect("/client/home");
  } catch (error) {
    console.log(error);
    req.flash("errors", `An error ocurred update your profile ${error}`);
    return res.redirect("/client/home");
  }
}
