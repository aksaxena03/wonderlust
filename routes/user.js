const express = require('express')
const router = express.Router({ mergeParams: true })
const app = express();
const mongoose = require('mongoose');
const User = require('../models/user');

const passport = require('passport')
const asyncwrap = require('../utils/asyncwrap');
const { saveRedirectUrl } = require('../utils/middleware.js')


const userController = require('../controllers/user.js')

router.route("/signup")
    .get(userController.userSignupRender)
    .post(asyncwrap(userController.userSignup))

router.route('/login')
    .get( userController.userLoginRender)
    .post( saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/user/login', failureFlash: true, }),
        userController.userLogin)
router.get('/logout', userController.userLogout)
// router.post('/login',async(req,res)=>{
//     let {username ,password}=req.body;
//     const vuser=await User.findOne({username:username});

//     if(vuser.password===password){
//         console.log('welcome')
//     }else{
//         req.flash('errMsg','invalid username & password')
//     }
// })
module.exports = router;