import mongoose, {Schema} from "mongoose"
import  bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {config} from "../configrations/config.js"


const userSchema = new  Schema({
    fullname :{
        type :String,
        required : true,
        trim  : true
    },
    email :{
        type :String,
        required : true,
        trim  : true,
        unique : true
    },
    password : {
        type : String ,
        required : true,
        trim : true
    },
    contact :{
        type : String,
        required : true,
        trim : true
    },
    role:{
        type :String ,
        enum : ["buyer" , "seller"],
        default : "buyer"
    },
    // isSeller :{
    //     type : Boolean,
    //     default : false
    // },

} , {timestamps : true})



userSchema.pre('save' , async function (){
    if(!this.isModified('password')) return;
    return this.password = await bcrypt.hash(this.password ,10);
});


userSchema.methods.comparePassword = async function (password){
    if(!password) return console.log("passowrd is required");
    return await bcrypt.compare(password , this.paswword);
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id : this._id,
            email:this.email,
            role: this.role
        },
        config.ACCESS_TOKEN_SECRET , {expiresIn : config.ACCESS_TOKEN_EXPIRE}
    )
}

export const User = mongoose.model("User",userSchema)