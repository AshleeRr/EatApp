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
    };

    req.session.save((error) => {
      if (error) {
        console.log("Session save error:", error);
        req.flash("errors", "An error ocurred while saving the session");
        res.redirect("/");
      }
      req.flash("success", "Logged in successfully");
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
    const {
      BussinessName, PhoneNumber, Email, Opening, Closing, Password, ConfirmPassword} = req.body;
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
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await context.user.create({
      role: "store",
      userName: BussinessName,
      email: Email,
      password: hashedPassword,
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
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await context.user.create({
      role: UserType,
      userName: UserName,
      email: Email,
      password: hashedPassword,
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
                    <p> Please click the link below so you can activate your account:</p>`,
      //<p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>`
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

export function GetResetPassword(req, res, next) {
  res.render("AuthenticationViews/resetPassword", {
    "page-title": "Reset Password",
    layout: "LogInLayout",
  });
}
export async function PostResetPassword(req, res, next) {

}
