export function GetLogIn(req, res, next){
    res.render("AuthenticationViews/login", {"page-title": "Log In", layout: "LogInLayout"});
}

export function GetSignUpBussiness(req, res, next){
    res.render("AuthenticationViews/signUp-bussiness", {"page-title": "Sign Up", layout: "LogInLayout"});
}
export async function PostSignUpBussiness(req, res, next){
    const {BussinessName, BussinessLogo, PhoneNumber, Email, Opening, Closing, Password, ConfirmPassword} = req.body;
    try{

    }catch(error){

    }
}


export function GetSignUpClient_Delivery(req, res, next){
    res.render("AuthenticationViews/signUp-client-delivery", {"page-title": "Sign Up", layout: "LogInLayout"});
}
export function PostSignUpClient_Delivery(req, res, next){
    const {Name, LastName, UserName, Email, PhoneNumber, ProfilePhoto, Password, ConfirmPassword} = req.body;
}

export function GetForgotPassword(req, res, next){
    res.render("AuthenticationViews/forgotPassword", {"page-title": "Forgot Password", layout: "LogInLayout"});
}
export function PostForgotPassword(req, res, next){}

export function GetResetPassword(req, res, next){
    res.render("AuthenticationViews/resetPassword", {"page-title": "Reset Password", layout: "LogInLayout"});
}
export function PostResetPassword(req, res, next){}