const express=require('express')
const router=express.Router({mergeParams:true}) 
//{mergeParams:true} is for merge data(:id) from app.js file  to review.js
const listing = require('../models/listing.js')
const review = require('../models/review.js')
const asyncwrap = require('../utils/asyncwrap.js')
const {isLoggedin,validateReviews,isReviewAuthor}=require('../utils/middleware.js')

const reviewController=require('../controllers/review.js')



//Review fetching form show ejs
router.post("/",isLoggedin,validateReviews,asyncwrap(reviewController.createReview))

//Delete rout for review
router.delete("/:reviewId",isLoggedin,isReviewAuthor, asyncwrap(reviewController.destroyReview))

module.exports=router;

