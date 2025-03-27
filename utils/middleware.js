const listing = require('../models/listing.js')
const { listingSchema,reviewSchema } = require('../schema.js')
const expressError = require('../utils/expressError.js')
const review = require('../models/review.js')

module.exports.isLoggedin = (req, res, next) => {
    // console.log(req.path, " ..  " ,req.originalUrl)
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl   // console.log(" ..",req.session.redirectUrl)
        req.flash('errMsg', 'logIn required')
        return res.redirect('/user/login')
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    } // console.log(res.locals.redirectUrl," .....",req.session.redirectUrl)
    next()
}
module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    if (req.user) {
        const amowner = await listing.findById(id);
        // console.log(amowner.owner,(res.locals.userlog._id))
        if (!amowner.owner.equals(res.locals.userlog._id)) {
            req.flash("errMsg", 'you are not the owner')
            return res.redirect(`/listing/${req.params.id}`);
        }
    }
    next()
}
module.exports.validatedetail = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((element) => element.message).join(", ");
        // console.log(error)// console.log(errMsg)
        throw new expressError(errMsg, 401)
    } else {
        next();
    }
}
//middelware for backend to validate reviews
module.exports.validateReviews = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((element) => element.message).join(", ");
        // console.log(error)
        // console.log(errMsg)
        throw new expressError(errMsg,401)
    } else {
        next();
    }
}
module.exports.isReviewAuthor=async(req,res,next)=>{
    let { reviewId } = req.params;
    const creview= await review.findById(reviewId)
    console.log(creview.author,(res.locals.userlog._id))
    if(!creview.author.equals(res.locals.userlog._id)){
        req.flash("errMsg","authorization failed,user not allowed to del.")
        return res.redirect(`/listing/${req.params.id}`)
    }
    next()
}