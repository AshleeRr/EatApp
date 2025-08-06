import context from "../context/AppContext.js";
import { sendEmail} from "../services/EmailService.js";
import bcrypt from "bcrypt";
import path from "path";
import {Op} from "sequelize";
import { projectRoot } from "../utils/Paths.js";

export function GetLogIn(req, res, next){
    res.render("AuthenticationViews/login", {"page-title": "Log In", layout: "LogInLayout"});
}

export async function PostLogIn(req, res, next){
    const {UserName_Mail, Password} = req.body;
    try{
        const user = await context.UserModel.findOne({where: {[Op.or]:[{email: UserName_Mail}, {userName: UserName_Mail}]}});
        if(!user){
            req.flash("errors", "No user was found with this credentials");
            return res.redirect("/");
        }
        const isPasswordValid = await bcrypt.compare(Password, user.password);
        if(!isPasswordValid){
            req.flash("errors", "The password is not correct. Try again");
            return res.redirect("/");
        }
        //set user session
        req.session.isAuthenticated = true;
        req.session.user = {
            id: user.id,
            userName: user.userName,
            email: user.email
        };

        req.session.save((error)=>{
            if(error){
                console.log("Session save error:", error);
                req.flash("errors", "An error ocurred while saving the session");
                res.redirect("/");
            }
            req.flash("success", "Logged in successfully");
            return res.redirect("/home");
        });

    }catch(error){
        console.log(error);
        req.flash("errors", "An error ocurred while logging in");
        return res.redirect("/");
    }
}

export function LogOut(req, res, next){
    req.session.destroy((error)=>{
        if(error){
            console.log("An error ocurred while loggging out:", error);
            req.flash("errors", "An error ocurred while trying to log out");
            res.redirect("/home");
        }
    });
    res.redirect("/");
}

// comercio
export function GetSignUpBussiness(req, res, next){
    res.render("AuthenticationViews/signUp-bussiness", {
    "page-title": "Sign Up", 
    layout: "LogInLayout"
    });
}
export async function PostSignUpBussiness(req, res, next){
    try{
        const {BussinessName, PhoneNumber, Email, Opening, Closing, Password, ConfirmPassword} = req.body;
        const BussinessLogo = req.file;
        const LogoPath = "\\" + path.resolve("public", BussinessLogo.path);

        if (Password !== ConfirmPassword){
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/user/signUp-bussiness");
        }
        const user = await context.UserModel.findOne({where: {email: Email}});
        if (user){
            req.flash("errors", "A user with this email already exists.");
            return res.redirect("/user/signUp-bussiness");
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await context.UserModel.create({
            role: "store",
            userName: BussinessName,
            email: Email,
            password: hashedPassword,
        });

        await context.Comercio.create({
            name: BussinessName,
            logo: LogoPath,
            phoneNumber: PhoneNumber,
            email: Email,
            opening: Opening,
            closing: Closing,
            password: hashedPassword,
            userId: newUser.id
        });
        req.flash("success", "The account has been created successfully.");
        await sendEmail({
            to: Email,
            subject: "Welcome to EatApp",
            html: `<p>Thank you for sign up your bussiness,</p>
             <p>We are so excited to work with you! Please click the link below to activate your account:</p>
             <p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>`
        });
        res.redirect("/"); 
    }catch(error){
        console.log(error);
    }
}

//delivery y cliente
export function GetSignUpClient_Delivery(req, res, next){
    res.render("AuthenticationViews/signUp-client-delivery", {
    "page-title": "Sign Up", 
    layout: "LogInLayout",
    });
}
export async function PostSignUpClient_Delivery(req, res, next){
    try{
        const {FirstName, LastName, UserName, Email, UserType, PhoneNumber, Password, ConfirmPassword} = req.body;

        const ProfilePhoto = req.file;
        const LogoPath = "\\" + path.resolve("public", ProfilePhoto.path);

        if (Password !== ConfirmPassword){
            req.flash("errors", "Passwords do not match.");
            return res.redirect("/user/signUp-client-delivery");
        }
        const user = await context.UserModel.findOne({where: {email: Email}})
        if (user){
            req.flash("errors", "A user with this email already exists.");
            return res.redirect("/user/signUp-client-delivery");
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await context.UserModel.create({
            role: UserType,
            userName: UserName,
            email: Email,
            password: hashedPassword,
        });
        if (UserType === "client"){
            await context.ClientModel.create({
                profilePhoto: LogoPath,
                name: FirstName,
                lastName: LastName,
                userName: UserName,
                phoneNumber: PhoneNumber,
                userId: newUser.id
            });
        }else{
            await context.DeliveryModel.create({
            profilePhoto: LogoPath,
            name: FirstName,
            lastName: LastName,
            userName: UserName,
            phoneNumber: PhoneNumber,
            userId: newUser.id
            });
        }
        req.flash("success", "The account has been created successfully.");
        await sendEmail({
            to: Email,
            subject: "Welcome to Assets App",
            html: `<p>Dear ${FirstName},</p>
                    <p>Thank you for registering. Now you can enjoy the magnitud of bussiness in your area without going out of your home</p>
                    <p> Please click the link below so you can activate your account:</p>`
                    //<p><a href="${process.env.APP_URL}/user/activate/${token}">Activate Account</a></p>`
        });
        res.redirect("/"); 
    }catch(error){
        console.log(error);
    }
}

export function GetForgotPassword(req, res, next){
    res.render("AuthenticationViews/forgotPassword", {"page-title": "Forgot Password", layout: "LogInLayout"});
}
export function PostForgotPassword(req, res, next){}

export function GetResetPassword(req, res, next){
    res.render("AuthenticationViews/resetPassword", {"page-title": "Reset Password", layout: "LogInLayout"});
}
export function PostResetPassword(req, res, next){}