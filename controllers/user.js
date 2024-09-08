const User = require("../models/user"); 

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try{ 
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
        if(err){
        return next(err);
        }
        req.flash("success", "Welcome to HAVEN HUB");
        res.redirect("/listings");
    }) 
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req, res)=> {
    req.flash("success", "Welcome to HAVEN HUB");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => { //req.logout is inside the passport library which directly helps in logging out of the website we do not have to wrtie a separate logic
        if(err) {
          return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
}
