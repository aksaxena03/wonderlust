const listing = require('../models/listing.js')



module.exports.index=async (req, res) => {
    const data = await listing.find({});
    res.render('./listing/index.ejs', { data })
}
module.exports.newListing=(req, res) => {
   
        // res.send("working newq")
    res.render("./listing/newfo.ejs")
    
}
module.exports.showListing=async (req, res) => {
    // if (!req.body.listing) {
    //     throw new expressError(401, "page not found")
    // } 
    const { id } = req.params
    // console.log(id)
    const listid = await listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner")
    // console.log(listid)
    
    // if(req.user){
    //     listid.viewer=req.user
    // }
    
    res.render('./listing/show.ejs', { listid })

}
module.exports.updateListingRender=async (req, res) => {
    let { id } = req.params;
    const listid = await listing.findById(id);
    // console.log(listid)
    let originalImg=listid.image.url
    originalImg.replace("/upload","/upload/c_crop,w_200")
    res.render('./listing/modify.ejs', { listid,originalImg });
}
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    // console.log(id,req.body ,req.body.listings)
    // // let newlisting={...req.body.listings};
    // console.log(newlisting)
    const listone=await listing.findByIdAndUpdate(id, { ...req.body.listing }, 
        { new: true, runValidators: true 
        });
    // console.log(am)
    console.log(req.file)
    if (typeof req.file!='undefined') {
        let filename = req.file.filename;
        let url = req.file.path;
        listone.image = {filename, url};
        await listone.save();
    }

    req.flash("msg", `${listone.title} is successfully updated`);
    res.redirect(`/listing/${id}`);
}
module.exports.newListingDb=async (req, res) => {
    // let {description:description,title:title,image:image,location:location,price:price}=req.body
    //mine
    // let am =["title","location","price"];
    // for (const item of am) {
    //     if(!req.body.item){throw new expressError(401,"data missing")}
    //      {let newlisting = new listing(req.body.listing);
    //         await newlisting.save();
    //         res.redirect('/listing')} 
    let newlisting = new listing(req.body.listing);
    newlisting.owner=req.user
    let filename=req.file.filename;
    let url=req.file.path;
    newlisting.image={filename,url}



    await newlisting.save();
    req.flash("msg","New listing is added!")
    res.redirect('/listing')
}

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params; // console.log(id)
    const delfind = await listing.findById(id); //console.log(delListing.reviews.length)
    const delListing = await listing.findByIdAndDelete(id); //console.log(delListing.reviews.length)
    //    delete reviews with listing by me
    // for (const item of delListing.reviews){
    //     console.log(item)
    //     const reviewDel = await review.deleteMany(item)
        
    // }
    req.flash("msg",`${delfind.title} is succsfully removed from listing`)
    res.redirect("/listing");
}