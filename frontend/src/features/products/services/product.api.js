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

