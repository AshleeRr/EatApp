//repositories
import admin from "../../repositories/admin/index.js";
//handlers
import { HandError } from "../../utils/handlers/handlerError.js";
import { HandControllersAsync } from "../../utils/handlers/handlerAsync.js";

//services
import { mailer } from "../../services/mailer.js";
import { Hash } from "../../services/hasher.js";
import { generateToken } from "../../services/generateToken.js";

export const index = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const admins = admin.adminRepository.getAllAdmins();

  return res.render("storeViews/admins/index", {
    title: "Administers",
    user: user,
    admins,
    hasadmins: admins.length > 0,
  });
});

export const createForm = HandControllersAsync(async (req, res) => {
  const user = req;
  const FindAdmin = await admin.adminRepository.findOne(user);

  if (!FindAdmin) HandError(400, "No tienes permiso para acceder a esta ruta");

  return res.render("storeViews/admins/create", {
    title: "Create Admin",
    user: user,
  });
});

export const create = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { name, email, password } = req.body;

  const hashedPassword = await Hash(password);
  const token = await generateToken;

  const newAdmin = await admin.adminRepository.create({
    role: "admin",
    userName: name,
    email: email,
    password: hashedPassword,
    isActive: false,
    activateToken: token,
  });

  if (!newAdmin)
    HandError(500, "Error al crear el nuevo administrador, intenta de nuevo");

  await mailer({
    to: email,
    subject: "Welcome to Zipy",
    html: `<h1>An admin added you to zipy</h1>
             <p>We are so excited to work with you! Please click the link below to activate your admin account:</p>
             <img src="https://i5.walmartimages.com/seo/Avanti-Press-Kitten-Rainbow-Funny-Humorous-Cat-Congratulations-Card_1d585531-d998-40f6-b245-fcfb3e29aca2.87e2f0022e73ba3e4fd26995970c829f.jpeg" alt="gato con arcoiris" width="200px" height="200px">
             <p><a href="http://localhost:${process.env.PORT}/user/activate/${token}">Activate Account</a></p>`,
  });

  req.flash("success", "The account has been created!");

  return res.redirect("/admins/home");
});

export const editForm = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const adminId = req.params.id;
  const admin = await admin.userRepository.findOne(adminId);

  if (!admin) HandError(404, "Administrador no encontrado");

  return res.render("storeViews/admins/create", {
    title: "Editing an Administrator",
    user: user,
    isEditing: true,
    admin,
  });
});

export const edit = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const { nombre, apellido, cedula, correo, usuario, contrasenia } = req.body;

  const hashedPassword = Hash(contrasenia);

  const edited = await admin.adminRepository.create({
    name: nombre,
    lastName: apellido,
    dominicanID: cedula,
    email: correo,
    user: usuario,
    pass: hashedPassword,
  });

  if (!edited) HandError(500, "Error al editar el producto");

  req.flash("success", "The admin account has been edited!!");

  return res.redirect("/admins/home");
});

export const deleteA = HandControllersAsync(async (req, res) => {
  const { user } = req.session;

  console.log("user :>> ", user);
  if (user.role !== "admin") {
    HandError(403, "No tienes permisos para acceder a esta ruta");
  }
  const adminId = req.params.id;
  const Admin = await admin.adminRepository.findOne(user);

  if (!Admin) HandError(404, "Administrador no encontrado");

  await admin.adminRepository.delete(adminId);

  req.flash("success", "The admin account has been deleted!!");

  return res.redirect("/admins/home");
});
