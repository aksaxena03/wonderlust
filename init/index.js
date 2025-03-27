const mongoose=require('mongoose');
const listing=require('../models/listing.js')
const review=require('../models/review.js')
const initdata=require('./sample.js')
main()
.then(()=>{
console.log("mongo sample data connected")
}).catch((err)=>{console.log(err)})
async function main()
{await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")}


const initDB=async ()=>{
    await listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'67ace14506680560780d45a5'}))
    await listing.insertMany(initdata.data)
    console.log("data added sucesfully")
}

initDB();