import context from "../config/context/AppContext.js";
import { mailer } from "../services/mailer.js";
import bcrypt from "bcrypt";
import path from "path";
import { Op } from "sequelize";
import { promisify } from "util";
import { randomBytes } from "crypto";

import { HandError } from "../utils/handlers/handlerError.js";

export function GetLogIn(req, res, next) {
  res.render("AuthenticationViews/login", {
    "page-title": "Log In",
   // layout: "LogInLayout",
  });
}

export async function CreateAdmin() {
  const admin = await context.User.findOne({ where: { role: "admin" } });
  const hashedPassword = await bcrypt.hash( process.env.ADMIN_PASS || "contra123", 10);
  try {
    if (!admin) {
      //const nuevoAdmin =
       await context.User.create({
        role: "admin",
        userName: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        isActive: true,
        activateToken: null,
      });

      //console.log("nuevoAdmin :>> ", nuevoAdmin);

     /* if (!nuevoAdmin)
        HandError(500, "An error ocurred while creating the admin");*/

      console.log("Admin created");
    } else {
      console.log("An administrator already exists");
    }
  } catch (error) {
    console.log("An error ocurred while creating the general admin:", error);
  }
}

export async function PostLogIn(req, res, next) {
  const { UserName_Mail, Password } = req.body;
  try {
    const user = await context.User.findOne({
      where: {
        [Op.or]: [{ email: UserName_Mail }, { userName: UserName_Mail }],
      },
    });
    if (!user) {
      req.flash("errors", "No user was found with this credentials");
      return res.redirect("/");
    }
    if (user.isActive == false) {
      req.flash("errors", "This user is not active. Please check your email");
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
      role: user.role,
    };

    req.session.save((error) => {
      if (error) {
        console.log("Session save error:", error);
        req.flash("errors", "An error ocurred while saving the session");
        return res.redirect("/");
      }
      switch (user.role) {
        case "client": res.redirect("/client/home"); break;
        case "admin": res.redirect("/admin/home"); break;
        case "store": res.redirect("/store/index"); break;
        case "delivery": res.redirect("/delivery/home"); break;
        default:
          req.flash(
            "errors",
            "That role does not exist yet. Contact and admin"
          );
          return res.redirect("/");
      }
      //return res.redirect("/home");
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
      return res.redirect("/home");
    }
  });
  return res.redirect("/");
}

export async function GetSignUpBusiness(req, res, next) {
  const result = await context.TipoComercio.findAll();
  const businessTypes = result.map((r) => r.get({ plain: true }));
  if (!businessTypes.length > 0) {
    req.flash(
      "success",
      "We're sorry, there are no types of business yet. Try later or contact an admin"
    );
    return res.redirect("/");
  }
  res.render("AuthenticationViews/signUp-business", {
    "page-title": "Sign Up",
   // layout: "LogInLayout",
    businessTypeList: businessTypes,
    hasBusinessTypes: businessTypes.length > 0,
  });
}
export async function PostSignUpBusiness(req, res, next) {
  try {
    const {
      BusinessName,
      PhoneNumber,
      Email,
      Opening,
      Closing,
      Password,
      ConfirmPassword,
      BusinessTypeId,
    } = req.body;
    const BusinessLogo = req.file;
    const LogoPath = "\\" + path.relative("public", BusinessLogo.path);

    if (Password !== ConfirmPassword) {
      req.flash("errors", "Passwords do not match.");
      return res.redirect("/user/signUp-business");
    }
    const user = await context.User.findOne({ where: { email: Email } });
    if (user) {
      req.flash("errors", "A user with this email already exists.");
      return res.redirect("/user/signUp-business");
    }
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await context.User.create({
      role: "store",
      userName: BusinessName,
      email: Email,
      password: hashedPassword,
      isActive: false,
      activateToken: token,
    });

    await context.Comercio.create({
      name: BusinessName,
      logo: LogoPath,
      phoneNumber: PhoneNumber,
      email: Email,
      opening: Opening,
      closing: Closing,
      password: hashedPassword,
      userId: newUser.id,
      tipoComercioId: BusinessTypeId,
    });
    req.flash(
      "success",
      "The account has been created successfully. Please check your email."
    );
    await mailer({
      to: Email,
      subject: "Welcome to Zipy",
      html: `<p>Thank you for sign up your business,</p>
             <p>We are so excited to work with you! Please click the link below to activate your account:</p>
             <img src="https://i5.walmartimages.com/seo/Avanti-Press-Kitten-Rainbow-Funny-Humorous-Cat-Congratulations-Card_1d585531-d998-40f6-b245-fcfb3e29aca2.87e2f0022e73ba3e4fd26995970c829f.jpeg" alt="gato con arcoiris" width="200px" height="200px">
             <p><a href="${process.env.APP_URL}${process.env.PORT}/user/activate/${token}">Activate Account</a></p>`,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("erros", "An error ocurred while signing you up");
    return res.redirect("/");
  }
}

export function GetSignUpClient_Delivery(req, res, next) {
  res.render("AuthenticationViews/signUp-client-delivery", {
    "page-title": "Sign Up",
   // layout: "LogInLayout",
  });
}
export async function PostSignUpClient_Delivery(req, res, next) {
  try {
    const {
      FirstName,
      LastName,
      UserName,
      Email,
      UserType,
      PhoneNumber,
      Password,
      ConfirmPassword,
    } = req.body;

    const ProfilePhoto = req.file;
    const LogoPath = "\\" + path.relative("public", ProfilePhoto.path);

    if (Password !== ConfirmPassword) {
      req.flash("errors", "Passwords do not match.");
      return res.redirect("/user/signUp-client-delivery");
    }
    const user = await context.User.findOne({ where: { email: Email } });
    if (user) {
      req.flash("errors", "A user with this email already exists.");
      return res.redirect("/user/signUp-client-delivery");
    }
    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await context.User.create({
      role: UserType,
      userName: UserName,
      email: Email,
      password: hashedPassword,
      isActive: false,
      activateToken: token,
    });
    if (UserType === "client") {
      await context.Client.create({
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
        userId: newUser.id,
      });
    } else {
      await context.Delivery.create({
        profilePhoto: LogoPath,
        name: FirstName,
        lastName: LastName,
        userName: UserName,
        phoneNumber: PhoneNumber,
        userId: newUser.id,
      });
    }
    req.flash(
      "success",
      "The account has been created successfully. Please check your email."
    );
    await mailer({
      to: Email,
      subject: "Welcome to Zipy",
      html: `<p>Dear ${FirstName},</p>
                <p>Thank you for registering.</p>
                <p>
                  ${UserType === "client" ? "Now you can enjoy the magnitud of business in your area without going out of your home!"
                      : "We are excited to work with you. Welcome to the Zipy family!"}
                </p>
                <p> Please click the link below so you can activate your account and enjoy:</p>
                <p><a href="${process.env.APP_URL}${process.env.PORT}/user/activate/${token}">Activate Account</a></p>`,
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("errors", "An error ocurred while signing you up");
    return res.redirect("/");
  }
}

export function GetForgotPassword(req, res, next) {
  res.render("AuthenticationViews/forgotPassword", {
    "page-title": "Forgot Password",
   // layout: "LogInLayout",
  });
}
export async function PostForgotPassword(req, res, next) {
  try {
    const { UserName_Mail } = req.body;
    const user = await context.User.findOne({
      where: {
        [Op.or]: [{ email: UserName_Mail }, { userName: UserName_Mail }],
      },
    });

    if (!user) {
      req.flash("errors", "There is no user with this credentials");
      return res.redirect("/user/forgotPassword");
    }

    const randomBytesAsync = promisify(randomBytes);
    const buffer = await randomBytesAsync(32);
    const token = buffer.toString("hex");

    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000;
    const result = await user.save();
    if (!result) {
      req.flash("errors", "An error ocurred while saving the reset token");
      return res.redirect("/user/forgotPassword");
    }

    await mailer({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Dear ${user.userName},</p>
             <p>You requested a password reset. Please click the link below to reset your password:</p>
             <p><a href="${process.env.APP_URL}${process.env.PORT}/user/resetPassword/${token}">Reset Password</a>HERE</p>`,
    });
    req.flash("success", "The link has been sent to your email successfully");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("errors",`An error ocurred during this process, try again.`);
    return res.redirect("/user/forgotPassword");
  }
}

export async function GetResetPassword(req, res, next) {
  try {
    const { token } = req.params;
    if (!token) {
      req.flash("errors", "Invalid or expired token. Try again");
      return res.redirect("/user/forgotPassword");
    }

    const user = await context.User.findOne({
      where: {
        resetToken: token,
        resetTokenExp: {
          [Op.gte]: Date.now(),
        },
      },
    });

    if (!user) {
      req.flash("errors", "There is no user with this token. Try again");
      return res.redirect("/user/forgotPassword");
    }
    res.render("AuthenticationViews/resetPassword", {
      "page-title": "Reset Password",
     // layout: "LogInLayout",
      passwordToken: token,
      userId: user.id,
    });
  } catch (error) {
    console.log("An error ocurred at GetResetPassword:", error);
    req.flash("errors", "An error ocurred in the process");
    return res.redirect("/user/forgotPassword");
  }
}

export async function PostResetPassword(req, res, next) {
  const { passwordToken, userId, NewPassword, ConfirmNewPassword } = req.body;
  if (NewPassword !== ConfirmNewPassword) {
    req.flash("errors", "The passwords do not match");
    return res.redirect(`/user/reset/${passwordToken}`);
  }

  const user = await context.User.findOne({
    where: {
      id: userId,
      resetToken: passwordToken,
      resetTokenExp: { [Op.gte]: Date.now() },
    },
  });
  if (!user) {
    req.flash("errors", "Invalid or expired token. Please try again");
    return res.redirect("/user/forgotPassword");
  }
  const hashedPassword = await bcrypt.hash(NewPassword, 10);
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpiration = null;
  await user.save();
  req.flash("success", "Password reset successfully");
  return res.redirect("/");
}

export async function UpdatePassword(req, res, next) {
  try {
    req.user = req.session.user;
    const { CurrentPassword, NewPassword, ConfirmNewPassword } = req.body;

    const user = await context.User.findOne({
      where: { id: req.user.id }
    });

    if (!user) {
      req.flash("errors", "User not found");
      return res.redirect("/client/profile");
    }

    const match = await bcrypt.compare(CurrentPassword, user.password);
    if (!match) {
      req.flash("errors", "The current password does not match");
      return res.redirect("/client/profile");
    }

    if (CurrentPassword === NewPassword) {
      req.flash("errors", "The new password can not be the same as the current.");
      return res.redirect("/client/profile");
    }

     if (NewPassword !== ConfirmNewPassword) {
      req.flash("errors", "The new passwords do not match.");
      return res.redirect("/client/profile");
    }

    const hashedPassword = await bcrypt.hash(NewPassword, 10);

    await context.User.update(
      { password: hashedPassword },
      { where: { id: req.user.id } }
    );

    req.flash("success", "Your password has been updated successfully");
    return res.redirect("/user/logOutWithoutAuth");
  } catch (error) {
    console.log(error);
    req.flash("errors", "An error occurred while updating your password");
    return res.redirect("/client/profile");
  }
}

export async function GetActivate(req, res, next) {
  const { token } = req.params;
  if (!token) {
    req.flash("errors", "Invalid or expired token. Please try again");
    return res.redirect("/");
  }
  try {
    const user = await context.User.findOne({
      where: { activateToken: token },
    });
    if (!user) {
      req.flash("errors", "Invalid activation token. Try again.");
      return res.redirect("/");
    }
    user.isActive = true;
    user.activateToken = null;
    await user.save();
    req.flash(
      "success",
      "Your account was activated successfully. Log in and enjoy."
    );
    return res.redirect("/");
  } catch (error) {
    console, log(error);
    req.flash(
      "errors",
      "An error ocurred while trying to active yout account. Try again"
    );
    return res.redirect("/");
  }
}

export async function PostDisableAccount(req, res, next) {
 try{
  req.user = req.session.user;
  const user = await context.User.findOne({where:{id:req.user.id}});
  if(!user){
    return res.redirect(`/${req.user.role}/home`); //check this
  }
  await context.User.update({
    isActive: false,
  },{where:{id:req.user.id}});
  req.flash("success", "Your account was disabled");
  return res.redirect("/user/logOutWithoutAuth");
 }catch(error){
  req.flash("errors", "An error ocurred trying to disable your account");
  //return res.redirect("/home"); //revisar que este este good
 }
}

export function GetLogInWithoutAuth(req, res, next) {
  res.render("AuthenticationViews/login", {
    "page-title": "Log In"
  });
}

