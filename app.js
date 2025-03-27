if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
    // console.log(process.env) // remove this after you've confirmed it is working

}

const express = require('express')
const app = express();
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsmate = require('ejs-mate')
const expressError = require('./utils/expressError.js')
// const joi=require('joi')

const ListingRouter=require('./routes/listing.js');
const reviewsRouter=require('./routes/review.js');
const userRouter=require('./routes/user.js')

const Mongostore=require('connect-mongo')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy=require("passport-local")
const User=require('./models/user.js');

const mongodb_url=process.env.ATLASDB_URL; //password for mongodb


app.set('views engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsmate);

app.use(express.static(path.join(__dirname, 'public')));
main().then(() => { console.log('mongo connected') }).catch((e) => { console.log(e) });
async function main() {
    await mongoose.connect(mongodb_url)// atlas database
}

const store = Mongostore.create({
    mongoUrl: mongodb_url,
    crypto:{
        secret:process.env.SECRET
    },
   
    touchAfter: 24 * 3600 //session log in timeout
});
const sessionop={
   store:store, 
   secret: process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAges:7*24*60*60*1000,
    httpOnly:true
   }
    
}
// app.get('/root', (req, res) => {
//     res.send('working')
// })

app.get('/', (req, res) => {
    res.redirect("/listing")
})
app.use(session(sessionop));
app.use(flash());

//passport middilware

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.msgs=req.flash("msg")
    res.locals.errMsgs=req.flash("errMsg")
    res.locals.userlog=req.user;
    next();
})
app.use('/listing',ListingRouter)
app.use('/listing/:id/reviews',reviewsRouter)
app.use('/listing/user',userRouter)




// app.get('/demouser',async(req,res)=>{
//     let fakeuser=new User({
//         username:"akhil",
//         email:'akhil@gmail.com'
//     })
//     const newuser= await User.register(fakeuser,'akhilsaxena')
//     // await User.save()
//     res.send(newuser)
// })

// app.get ('/listing',async (req,res)=>{
//     const lis =new listing({
//         title:'mylonge',description:'near intop veiw point',price:12,location:"satpuli sain" ,location:'india'
//     })
//     await lis.save()
//     console.log(lis
//     res.send(lis)
// })
app.all("*", (req, res, next) => {
    next(new expressError(500, "page not found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "something went wrong" } = err;
    res.status(status).render("./listing/error.ejs", { err })
    // res.status(status).send(message);
    // res.send("<marquee><h2>somthing went wrong!</h2></marquee>")
})
app.listen(8080, () => { console.log("server 8080 is listening") })
