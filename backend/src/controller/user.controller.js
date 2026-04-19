import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import  {ApiResponse} from '../utils/ApiResponse.js';
import {User} from '../models/user.models.js';

// register user controller
export const resgisterUser = asyncHandler ( async ( req , res) =>{
    const {fullname ,email,password ,contact ,isSeller} = req.body;
    
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
        role : isSeller ? 'seller' : "buyer",
        isSeller : isSeller ? true : false
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

// login user controller

export const loginUser = asyncHandler ( async ( req , res) =>{
    const  {email ,password} = req.body;
    
    // check if user exist or not
    const user =  await User.findOne({email});
    if(!user){
        return res.status(404).json( new ApiError(404,"User not found with this email."));
    };
   
 
    // if user exist then check password
    const isPasswordCorrect = await user.isComparePassword(password);

    if(!isPasswordCorrect){
        return res.status(401).json( new ApiError(401,"Invalid password."));
    };
    // generate token
    const snitch_token = user.generateAccessToken();
    
    if(!snitch_token){
        return res.status(401).json( new ApiError(401,"Failed to generate token."));
    }

    const options={
        httpOnly : true,
        sameSite : "strict",
        secure : false
    };
    return res.status(200)
    .cookie('snitch_token',snitch_token , options)
    .json( new ApiResponse(
        200,
        user,
        "User logged in successfully."
    ))
})

// login or register with google
export const  googleCallback = asyncHandler( async (req, res) => {
    const {id ,displayName, emails,photos} = req.user;
    const email = emails[0].value;
    const profilePic = photos[0]?.value;

    // find user 
    let user = await User.findOne({
        email
        });

    // if user is not registered create one
    if(!user){
        user = await User.create({
            email,
            googleId : id,
            fullname : displayName,
        })
    };

    // generate token 
    const snitch_token = await user.generateAccessToken();
    

    const options ={
        httpOnly : true,
        secure : true,
        sameSite : 'strict',
        maxAge : 24 * 60 * 60 * 1000,
    }

    // set into cookies

    return res.status(200)
    .cookie('snitch_Token' , snitch_token , options)
    .redirect('http://localhost:5173/')
    
})



// get me logged in user details or user

export const  getMe = asyncHandler( async( req ,res)=>{
    const user = req?.user;

    const loggedInUser = await User.findById(user?._id).select('-password');

    if (!loggedInUser) {
        return res.status(300).json( new ApiError( 300 , "User Not logged in! Please login first."))
    };

    return res.status(200).json( new ApiResponse(200 , loggedInUser , `welcome back ${loggedInUser?.fullname} ` ))
    
})