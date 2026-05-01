import axios from 'axios'


const productInstance = axios.create({
    baseURL : '/api/products',
    withCredentials: true
});


// create product api
export const createProduct = async (formData) =>{
    const response = await productInstance.post('/create',(formData));
    return response.data;
};

// get seller product created by seller

export const getSellerProducts = async ()=>{
    const response = await productInstance.get('/seller');
    return response.data;
}

// get all products
export const getAllProducts = async () =>{
    const response = await productInstance.get('/all-products');
    return response.data;
}


export const getroductDetails = async (productId) =>{
    const response = await productInstance.get(`/product-detail/${productId}`);
    return response.data;
}

// // create variant
// export const createVariant = async (productId, variantData) => {
//     const response = await productInstance.post(`/${productId}/variants`, variantData);
//     return response.data;
// };

// // update stock
// export const updateVariantStock = async (productId, variantId, stocks) => {
//     const response = await productInstance.patch(`/${productId}/variants/${variantId}/stock`, { stocks });
//     return response.data;
// };


// create variant

export const addProductVariant = async ( productId ,  newProductVariant) =>{
    const newFormData =  new FormData();

    newProductVariant.images.forEach((image) =>{
        newFormData.append(`images` , image.file)
    });
    newFormData.append('title', newProductVariant.title);
    newFormData.append('description', newProductVariant.description);
    newFormData.append('stock', newProductVariant.stock);
    newFormData.append('priceAmount' , newProductVariant.price?.amount);
    newFormData.append('priceCurrency', newProductVariant.price?.currency);
    newFormData.append('attributes' , JSON.stringify(newProductVariant.attributes));

    const response = await productInstance.post(`/${productId}/add-variant`, newFormData);
    return response.data;

}

