import context from "../config/context/AppContext.js";
import { mailer } from "../services/mailer.js";
import bcrypt from "bcrypt";
import path from "path";
import { Op } from "sequelize";
import { promisify } from "util";
import { randomBytes } from "crypto";


export function GetLogIn(req, res, next) {
  res.render("AuthenticationViews/login", {
    "page-title": "Log In",
    layout: "LogInLayout",
  });
}

export async function CreateAdmin(){
  try{
    const admin = await context.user.findOne({where:{role: "admin"}})
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS || "contra123", 10);

    if (!admin){
      await context.user.create({
        role: "admin",
        userName: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        isActive: true,
        activateToken: null,
      });
      console.log("Admin created");
    }else{
      console.log("An administrator already exists");
    }
    
  }catch(error){
    console.log("An error ocurred while creating the general admin");
  }
}

export async function PostLogIn(req, res, next) {
  const { UserName_Mail, Password } = req.body;
  try {
    const user = await context.user.findOne({
      where: {
        [Op.or]: [{ email: UserName_Mail }, { userName: UserName_Mail }],
      },
    });
    if (!user) {
      req.flash("errors", "No user was found with this credentials");
      return res.redirect("/");
    }
    if(!user.isActive){
      req.flash("errors", "This user is not active. Please check your email and activate it, or try again");
      return res.redirect("/");
    }

    const isPasswordValid = await bcrypt.compare(Password, user.password);
    if (!isPasswordValid) {
      req.flash("errors", "The password is not correct. Try again");
      return res.redirect("/");
    }
    //set user session
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role
    };

    req.session.save((error) => {
      if (error) {
        console.log("Session save error:", error);
        req.flash("errors", "An error ocurred while saving the session");
        res.redirect("/");
      }
      return res.redirect("/home");
    });
  } catch (error) {
    console.log(error);
    req.flash("errors", `An error ocurred while logging in: ${error}`);
    return res.redirect("/");
  }
}

export function LogOut(req, res, next) {
  req.session.destroy((error) => {
    if (error) {
      console.log("An error ocurred while loggging out:", error);
      req.flash("errors", "An error ocurred while trying to log out");
      res.redirect("/home");
    }
  });
  res.redirect("/");
}

// comercio
export function GetSignUpBussiness(req, res, next) {
  res.render("AuthenticationViews/signUp-bussiness", {
    "page-title": "Sign Up",
    layout: "LogInLayout",
  });
}
export async function PostSignUpBussiness(req, res, next) {
  try {
    const {BussinessName, PhoneNumber, Email, Opening, Closing, Password, ConfirmPassword} = req.body;
    const BussinessLogo = req.file;
    const LogoPath = "\\" + path.resolve("public", BussinessLogo.path);

    if (Password !== ConfirmPassword) {
      req.flash("errors", "Passwords do not match.");
      return res.redirect("/user/signUp-bussiness");
    }
    const user = await context.user.findOne({ where: { email: Email } });
    if (user) {
      req.flash("errors", "A user with this email already exists.");
      return res.redirect("/user/signUp-bussiness");
    }
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await context.user.create({
      role: "store",
      userName: BussinessName,
      email: Email,
      password: hashedPassword,
      isActive: false,
      activateToken: token
    });

    await context.comercio.create({
      name: BussinessName,
      logo: LogoPath,
      phoneNumber: PhoneNumber,
      email: Email,
      opening: Opening,
      closing: Closing,
      password: hashedPassword,
      userId: newUser.id,
    });
    req.flash("success", "The account has been created successfully.");
    await mailer({
      to: Email,
      subject: "Welcome to EatApp",
      html: `<p>Thank you for sign up your bussiness,</p>
             <p>We are so excited to work with you! Please click the link below to activate your account:</p>
             <p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>`,
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

//delivery y cliente
export function GetSignUpClient_Delivery(req, res, next) {
  res.render("AuthenticationViews/signUp-client-delivery", {
    "page-title": "Sign Up",
    layout: "LogInLayout",
  });
}
export async function PostSignUpClient_Delivery(req, res, next) {
  try {
    const {FirstName, LastName, UserName, Email, UserType, PhoneNumber,Password, ConfirmPassword} = req.body;

    const ProfilePhoto = req.file;
    const LogoPath = "\\" + path.resolve("public", ProfilePhoto.path);

    if (Password !== ConfirmPassword) {
      req.flash("errors", "Passwords do not match.");
      return res.redirect("/user/signUp-client-delivery");
    }
    const user = await context.user.findOne({ where: { email: Email } });
    if (user) {
      req.flash("errors", "A user with this email already exists.");
      return res.redirect("/user/signUp-client-delivery");
    }
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await context.user.create({
      role: UserType,
      userName: UserName,
      email: Email,
      password: hashedPassword,
      isActive: false,
      activateToken: token
    });
    if (UserType === "client") {
      await context.client.create({
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
        userId: newUser.id,
      });
    } else {
      await context.delivery.create({
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
        userId: newUser.id,
      });
    }
    req.flash("success", "The account has been created successfully.");
    await mailer({
      to: Email,
      subject: "Welcome to Assets App",
      html: `<p>Dear ${FirstName},</p>
                <p>Thank you for registering. Now you can enjoy the magnitud of bussiness in your area without going out of your home</p>
                <p> Please click the link below so you can activate your account:</p>,
                <p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>`
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
}

export function GetForgotPassword(req, res, next) {
  res.render("AuthenticationViews/forgotPassword", {
    "page-title": "Forgot Password",
    layout: "LogInLayout",
  });
}
export async function PostForgotPassword(req, res, next) {
  try{
    const {UserName_Mail } = req.body;
    const user = await context.user.findOne({where: 
      {[Op.or]: [{email: UserName_Mail}, {userName: UserName_Mail}]}});
    if(!user){
      req.flash("errors", "There is no user with this credentials");
      return res.redirect("/user/forgotPassword");
    }

    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    const result = await user.save();
    if(!result){
      req.flash("errors", "An error ocurred while saving the reset token");
      return res.redirect("/user/forgotPassword");
    }

    await sendEmail({
      to: Email,
      subject: "Password Reset Request",
      html: `<p>Dear ${user.userName},</p>
             <p>You requested a password reset. Please click the link below to reset your password:</p>
             <p><a href="${process.env.APP_URL}/user/resetPassword/${token}">Reset Password HERE</a></p>`
    });

    req.flash("success", "The link has been sent to your email successfully");
    return res.redirect("/")
  }catch(error){
    req.flas("errors", "An error ocurred during this process, try again.")
  }
}

export async function GetResetPassword(req, res, next) {
  const {token} = req.params;
  if(!token){
    req.flash("errors", "Invalid or expired token.Try again");
    return res.redirect("/user/forgotPassword");
  }
  try{
    const user = await context.user.findOne({
      where:{
        resetToken: token, resetTokenExpiration: {
          [Op.gte]: Date.now()}
        }});

      if(!user){
        req.flash("errors", "Invalid or expired token.Try again");
        return res.redirect("/user/forgotPassword");
      }

      res.render("AuthenticationViews/resetPassword", {"page-title": "Reset Password", layout: "LogInLayout",
        passwordToken: token, userId: user.Id});

  }catch(error){
    req.flash("errors", "");
    return res.redirect("");
  }
}

export async function PostResetPassword(req, res, next) {
  const {passwordToken, userId, NewPassword, ConfirmNewPassword} = req.body;
  if(NewPassword !== ConfirmNewPassword){
    req.flash("errors", "The passwords do not match")
    return res.redirect(`/user/reset/${passwordToken}`);
  }

  const user = await context.user.findOne({
    where:{
      id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: {[Op.gte]: Date.now()}
    }});
    if(!user){
      req.flash("errors", "Invalid or expired token. Please try again");
      return res.redirect("/user/forgotPassword")
    }
    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    req.flah("success", "Password reset successfully");
    return res.redirect("/");
}

export async function GetActivate(req, res, next){
  const {token} = req.body;
  if(!token){
    req.flash("errors", "Invalid or expired token. Please try again");
    req.redirect("/");
  }
  try{
    const user = await context.user.findOne({where:{activateToken: token}});
    if(!user){
      req.flash("errors", "Invalid activation token. Try again.");
      res.redirect("/");
    }
    user.isActive = true;
    user.activateToken = null;
    await user.save();
    req.flash("success", "Your account was activated successfully. Log in and enjoy.");
    return res.redirect("/");

  }catch(error){
    console,log(error);
    req.flash("errors", "An error ocurred while trying to active yout account. Try again");
    return res.redirect("/");
  }

}