const mongoose = require('mongoose');
const User = require('../models/user');

const passport = require('passport')
const asyncwrap = require('../utils/asyncwrap');
const { saveRedirectUrl } = require('../utils/middleware.js')



module.exports.userSignupRender=async (req, res) => {
    res.render('./user/signup.ejs')
}
module.exports.userSignup= async (req, res, next) => {
    try {
        // let newuser =new User(req.body.Users)
        let { username, email, password } = req.body;
        let newuser = new User({ username, email })
        let regUser = await User.register(newuser, password)
        // console.log(regUser)
        req.login(regUser,(err)=>{
            if(err){
               return next(err); 
            }else{
                req.flash('msg', `${username} Registered Successfully, Welcome to wonderlust`)
                res.redirect('/listing')
            }
            
        })
    } catch (error) {
        req.flash('errMsg', error.message || 'Registration failed')
        res.redirect('/user/signup')
    }
}
module.exports.userLoginRender=(req, res) => {
    res.render('./user/login.ejs')
}
module.exports.userLogin=async (req, res) => {
    if(res.locals.redirectUrl){
        req.flash("msg", "welcome back to wanderlust");
        let newRedirect =res.locals.redirectUrl ||'/listing'
        res.redirect(newRedirect)

    }else{
        res.redirect('/listing')
    }     
}
module.exports.userLogout=(req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash('msg', 'logout successfully')
        res.redirect('/listing')
    })


}