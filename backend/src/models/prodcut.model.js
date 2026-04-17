import mongoose, {Schema} from 'mongoose'



const productSchema = new Schema({
    title :{
        type :String,
        required : true,
        trim : true
    },
    description :{
        type :String,
        required :true,
        trim:true
    },
    seller :{
        type :mongoose.Schema.Types.ObjectId,
        ref :"User",
        required :true
    },
    price :{
        amount:{
            type :Number,
            required :true
        },
        currency :{
            type :String,
            enum :['USD','EUR','GBP','JYP','INR'],
            default :'INR'
        }
    },

    images:[
        {
            url : {
                type :String,
                required :true
            }
        }
    ]

} ,{timestamps:true});


export const productModel = mongoose.model("productModel",productSchema);