import mongoose, {Schema} from "mongoose"


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
    isSeller :{
        type : Boolean,
        default : false
    },

} , {timestamps : true})


export const User = mongoose.model("User",userSchema)