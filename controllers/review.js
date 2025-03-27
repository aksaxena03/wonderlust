const listing = require('../models/listing.js')
const review = require('../models/review.js')


module.exports.createReview=async (req, res) => {
    const listingsreview = await listing.findById(req.params.id);
    // console.log(req.params,listingsreview)
    let newReview = new review(req.body.review);
    // console.log(req.user)
    newReview.author=req.user._id;
    // console.log(newReview)
    listingsreview.reviews.push(newReview);
    await newReview.save();
    await listingsreview.save();
    // console.log(newReview)
    req.flash("msg","review is succsfully added")

    res.redirect(`/listing/${req.params.id}`);
}
module.exports.destroyReview=async (req, res) => {
    let { id, reviewId } = req.params;

    const listRvDel = await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    //using new concept of pull which help to remove item from array
    const reviewDel = await review.findByIdAndDelete(reviewId);
    // console.log(listRvDel, reviewDel)
    req.flash("msg","review is succsfully deleted")

    res.redirect(`/listing/${req.params.id}`)
}