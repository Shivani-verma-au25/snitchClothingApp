import {asyncHandler} from '../utils/asyncHandler.js'
import {productModel} from '../models/prodcut.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import { uploadFile } from '../services/storage.service.js'


// created product by seller
export const createProducts = asyncHandler(async ( req , res) =>{
    const {title ,description ,priceAmount ,priceCurreny } = req.body;
    const seller = req?.user;

    // have to se imagekit
    //todo :- add check - file is there or not only excute uploadfile only when filer is exist 
    let images = null;

    try {
        images = await Promise.all(req.files.map(async (file) =>{
            return await uploadFile({
                buffer:file.buffer,
                fileName:file.originalname
            })
    }))
    } catch (error) {
     console.log("Error while uploading file" ,error);
        return res.status(404).json( new ApiError(404 , "Error while uploading file", error.message))
    };
    // create product 
    const product = await productModel.create({
        title,
        description,
        price:{
            amount : priceAmount,
            currency : priceCurreny || 'INR'
        },
        images,
        seller :seller._id
    });
    //  find prodct is created product
    const createdProduct = await productModel.findById(product?._id);
    // check is prodcut created
    if (!product) {
        return res.status(404).json( new ApiError( 404 , "PRoduct is not ccreated Yet." ))
    };

    //  return response if product cccretaed
    return res.status(200).json( new ApiResponse (
        200,
        product,
        "Product created successfully."
    ))
})


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
    
    const allProducts = await productModel.find();
    if (!allProducts) {
        return res.status(404).json( new ApiError( 404 ,"Product not found."))
    }

    return res.status(200).json( new ApiResponse( 200 , allProducts ,"All Products fetched successfully."))
})