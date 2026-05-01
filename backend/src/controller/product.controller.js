import {asyncHandler} from '../utils/asyncHandler.js'
import {productModel} from '../models/prodcut.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadFile } from '../services/storage.service.js'
import { json } from 'express'


// created product by seller
export const createProducts = asyncHandler(async (req, res) => {

    const { title, description, priceAmount, priceCurreny } = req.body;
    const seller = req.user;

    const files = req.files || [];

    const images = await Promise.all(
        files.map(file => uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        }))
    );

    if (!images) {
        return res.status(404).json( new ApiError(404 , "Iamge is not provided."))
        
    }
    // console.log("uploaded images:", images); // 🔥 debug

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurreny || "INR"
        },
        images: images, // ✅ FIXED
        seller: seller._id
    });

    if (!product) {
        return res.status(400).json(
            new ApiError(400, "Product not created")
        )
    }
    return res.status(201).json(
        new ApiResponse(201, product, "Product created successfully")
    );
});

// get all created products by seller

export const getProductCreatedBySeller = asyncHandler ( async ( req,res) => {
    // get seller from req.user
    const seller = req?.user;

    // find products related to the seller or created by the seller

    const product = await productModel.find({seller : seller?._id});
    
    if (!product  || product.length === 0) {
        return res.status(404).json( new ApiError( 404 ,"Product not found."))
    };

    return res.status(200).json( new ApiResponse( 200 , product ," Products fetched successfully."))
});

// get all products

export const getAllproducts = asyncHandler ( async ( req , res) => {
    
    // const allProducts = await productModel.find().populate('seller',"fullname contact email");
    const allProducts = await productModel.find()

    
    if (!allProducts) {
        return res.status(404).json( new ApiError( 404 ,"Product not found."))
    }

    return res.status(200).json( new ApiResponse(
         200 , 
        allProducts ,
         "All Products fetched successfully."
         ))
})


export const getProductDetails = asyncHandler ( async ( req, res) => {
    const {id} = req.params;

    const product = await productModel.findById(id);
    if(!product){
        return res.status(404).json( new ApiError( 404 , "Product not found."))
    };

    return res.status(200).json( new ApiResponse(200 , product ,"Product details fetched."))

})


// create variants  

export const addProductVariants = asyncHandler( async (req ,res) => {
    const {productId} = req.params;
    const product = await productModel.findById({
        _id:productId,
        seller : req?.user._id
    });

    if(!product){
        return res.status(404).json( new ApiError(404 , "Product not found."))
    } ;
   
    const files  = req.files;
    const images = [];
    if (files || files.length !== 0){
       (await Promise.all(files.map( async (file) =>{
        const image = await uploadFile({
            buffer : file.buffer,
            fileName : file.originalname
        });
        return image;
       }))).map( image => images.push(image))
    };



    const price = req.body.priceAmount;
    const stock = req.body.stock;
    const attributes = JSON.parse( req.body.attributes || "{}")
    console.log("variants" , product);
    console.log("images" , images);
    console.log("stock" , stock);
    console.log("atri" , attributes);


    product.variants.push({
        images,
        price:{
            amount:Number(price) || product.price?.amount,
            currency:req.body.priceCurreny || product.price.currency
        },
        stock,
        attributes
    });

    await product.save();
    return res.status(200).json( new ApiResponse (
        200,
        product,
        "Product Variant added successfully."
    ))

})