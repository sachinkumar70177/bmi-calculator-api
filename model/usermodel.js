const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:{type:String,unique:true},
    gender:String,
    password:String,
})
const UserModel=mongoose.model("users",userSchema)

module.exports={
    UserModel,
}