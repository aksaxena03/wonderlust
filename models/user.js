const mongoose=require('mongoose')
const Schema=mongoose.Schema
const passportmongoose=require('passport-local-mongoose')

const userSchema=new Schema({
    email:{
        type:String,
        require:true
    }
})

userSchema.plugin(passportmongoose)
module.exports=mongoose.model("User",userSchema)