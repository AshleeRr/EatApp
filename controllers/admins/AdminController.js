//repositories
import admin from "../../repositories/admin/index.js";
//handlers
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

//services
import { mailer } from "../../services/mailer.js";
import { Hash } from "../../services/hasher.js";
import { generateToken } from "../../services/generateToken.js";
import adminRepository from "../../repositories/admin/adminRepository.js";
import { where } from "sequelize";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const admins = await admin.adminRepository.getAllAdmins();
  const data = admins.map((a) => a.dataValues);

  const ids = data.map((a) => a.userId);

  const dataU = await admin.userRepository.findAll({ where: { id: ids } });
  console.log("data users :>> ", dataU);

  const users = dataU.map((data) => data.dataValues);
  const adminsUsers = data.map((admin) => {
    const user = users.find((u) => u.id === admin.userId);
    return {
      ...admin,
      user,
    };
  });

  console.log("adminUsers :>> ", adminsUsers);

  return res.render("adminViews/admins/index", {
    title: "Administers",
    hasadmins: data.length > 0,
    admins: adminsUsers,
  });
});

export const createForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  return res.render("adminViews/admins/create", {
    title: "Create Admin",
    user: user,
  });
});

export const create = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { nombre, apellido, usuario, cedula, correo, password, confirmacion } =
    req.body;

  if (password !== confirmacion) {
    req.flash("Las contraseñas no son las mismas intenta de nuevo");
    return res.redirect("/admin/admins/create");
  }
  const hashedPassword = await Hash(password);
  const token = await generateToken();

  const newAdmin = await admin.userRepository.create({
    role: "admin",
    userName: usuario,
    email: correo,
    password: hashedPassword,
    isActive: true,
    activateToken: token,
  });

  await admin.adminRepository.create({
    nombre: nombre,
    apellido: apellido,
    usuario: usuario,
    cedula: cedula,
    correo: correo,
    userId: newAdmin.id,
  });

  await mailer({
    to: correo,
    subject: "Welcome to Zipy",
    html: `<h1>Un administrador te ha añadido a nuestra App</h1>
             <h4>Tu usuario: ${usuario}</h4>
             <h4>Tu correo: ${correo}</h4>
             <h4>Tu contraseña: ${password}</h4>
             <img src="https://i5.walmartimages.com/seo/Avanti-Press-Kitten-Rainbow-Funny-Humorous-Cat-Congratulations-Card_1d585531-d998-40f6-b245-fcfb3e29aca2.87e2f0022e73ba3e4fd26995970c829f.jpeg" alt="gato con arcoiris" width="200px" height="200px">
             <h5><a href="http://localhost:3000/">Ir a la APP</a></h5>`,
  });

  req.flash("success", "The account has been created!");

  return res.redirect("/admin/admins/home");
});

export const editForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    throw HandError(403, "No tienes permisos para acceder a esta ruta");
  }

  const id = req.params.id;

  const adm = await admin.adminRepository.findById(id);

  if (!adm) {
    throw HandError(404, "Administrador no encontrado");
  }

  if (user.id === adm.userId) {
    req.flash("errors", "No puedes editar el usuario logueado");
    return res.redirect("/admin/admins/home");
  }

  return res.render("adminViews/admins/create", {
    title: "Editing an Administrator",
    user,
    isEditing: true,
    adm: adm.dataValues,
  });
});

export const edit = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { id } = req.params;
  const { nombre, apellido, cedula, correo, usuario, password, confirmacion } =
    req.body;

  if (password !== confirmacion) {
    const data = await admin.adminRepository.findById(id);
    const adm = data.dataValues;

    return res.render("adminViews/admins/create", {
      adm,
      user: user,
      isEditing: true,
      errors: ["Las contraseñas no son las mismas"],
    });
  }
  const hashedPassword = await Hash(password);

  const edited = await admin.adminRepository.update(id, {
    nombre,
    apellido,
    cedula,
    correo,
    usuario,
  });
  const usua = await admin.userRepository.update(edited.userId, {
    role: "admin",
    userName: usuario,
    email: correo,
    isActive: true,
    password: hashedPassword,
  });

  await mailer({
    to: correo,
    subject: "Welcome to Zipy",
    html: `<h1>Un administrador ha editado tus credenciales de acceso como administrador</h1>
             <h4>Tu usuario: ${usuario}</h4>
             <h4>Tu correo: ${correo}</h4>
             <h4>Tu contraseña: ${password}</h4>

             <img src="https://i5.walmartimages.com/seo/Avanti-Press-Kitten-Rainbow-Funny-Humorous-Cat-Congratulations-Card_1d585531-d998-40f6-b245-fcfb3e29aca2.87e2f0022e73ba3e4fd26995970c829f.jpeg" alt="gato con arcoiris" width="200px" height="200px">
             <h5><a href="http://localhost:3000/">Ir a la APP</a></h5>`,
  });

  if (!edited && usua) HandError(500, "Error al editar el producto");

  req.flash("success", "The admin account has been edited!!");

  return res.redirect("/admin/admins/home");
});

export const deleteA = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const id = req.params.id;
  console.log("id :>> ", id);
  const admina = await admin.adminRepository.findById(id);

  console.log("admina :>> ", admina);

  if (user.id === admina.userId) {
    req.flash("errors", "No puedes eliminar el usuario logueado");
    return res.redirect("/admin/admins/home");
  }
  const Admin = await admin.adminRepository.findById(id);
  const userDele = await admin.userRepository.findById(admina.userId);

  if (!Admin && !userDele) {
    req.flash("errors", "El administrador no fue encontrado");
    return res.redirect("/admin/admins/home");
  }
  await admin.userRepository.delete(admina.userId);
  await admin.adminRepository.delete(id);
  req.flash("success", "The admin account has been deleted!!");
  return res.redirect("/admin/admins/home");
});
