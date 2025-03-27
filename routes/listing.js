const express=require('express')
const router=express.Router()
const listing = require('../models/listing.js')
const asyncwrap = require('../utils/asyncwrap.js')
const expressError = require('../utils/expressError.js')
const flash=require('connect-flash')
const {isLoggedin,validatedetail,isowner}=require('../utils/middleware.js')
const listingController=require("../controllers/listing.js");

const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage: storage });

//middleware=>{validate all data or entries of required block 
// to prevent server crash}


//home page
router.route('/')
    .get( asyncwrap(listingController.index))
    .post(isLoggedin,upload.single('listing[image]'),validatedetail,asyncwrap(listingController.newListingDb))
    // .post(upload.single('listing[image]'),(req,res)=>{
    //     console.log(req)
    // res.send(req.file)
    // });



//new rout
router.get('/new', isLoggedin,(listingController.newListing))
//show route
router.get('/:id', asyncwrap(listingController.showListing))
//update route
router.get('/:id/edit',isLoggedin, asyncwrap(listingController.updateListingRender))
//update in mongo sql
router.put('/:id',isowner,upload.single('listing[image]'),validatedetail,asyncwrap(listingController.updateListing))
//search
router.post('/search/', asyncwrap(async (req, res) => {
    let place= req.body.place
    if (!req.body.place || Object.keys(req.body.place).length === 0) {
        req.flash("errMsg", "error: Search criteria required" );
        return res.redirect('/listing')

        // return res.status(400).json({ error: "Search criteria required" });
    }
    // Create search query
    const searchQuery = {
        $or: [
            { location: { $regex: req.body.place, $options: 'i' } },
            { country: { $regex: req.body.place, $options: 'i' } },
            { title: { $regex: req.body.place, $options: 'i' } }
        ]
    };

    // Find matching listings
    let result = await listing.find(searchQuery);
    console.log(result)
    if (result.length===0) {
        req.flash("errMsg", "error: No listing found");
        let newRedirect =res.locals.redirectUrl ||'/listing'
        return res.redirect(newRedirect)
        // return res.status(404).json({ error: "No listing found" });
    }
    res.render("listing/search.ejs",{place, result})
    
}));


//newfo=>ADD USINGMONGO create
router.post('/', validatedetail, asyncwrap(listingController.newListingDb))

//destroy route
router.delete('/:id',isLoggedin,isowner, asyncwrap(listingController.destroyListing))

module.exports=router;