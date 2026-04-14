import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import  {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.models.js';

// register user controller
export const resgisterUser = asyncHandler ( async ( req , res) =>{
    const {fullname ,email,password ,contact ,role,isSeller} = req.body;
    
    // check if user already exist
    const userExist = await User.findOne({
        $or : [
            {email},
            {contact}
        ]
    });

    if(userExist){
        return res.status(400).json(
            new ApiError(400,
            {},
            "User already exist with email or contact."
            )
        )
    }

    // if user not exist then create new user
    const user = await User.create({
        fullname,
        email,
        password,
        contact,
        role : role === 'seller' ? 'seller' : "buyer" || "buyer",
        isSeller : role === 'seller' ? true : false || false
     });

    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        return res.status(400).json(
            new ApiError(500, "Failed to create user.")
        )
    };

    // generate token
    const sntich_token = createdUser.generateAccessToken();
    if(!sntich_token){
        return res.status(401).json(
            new ApiError(400,"Failed to generate token.")
        )
    }
    
    const options ={
        httpOnly : true,
        sameSite : "strict",
        maxAge : 24 * 60 * 60 * 1000
        // secure : process.env.NODE_ENV === "production",
    }

    return res.status(201)
    .cookie('snitch_token',sntich_token , options)
    .json( new ApiResponse(
        201,
        createdUser,
        "User registered successfully."
    ))
})
