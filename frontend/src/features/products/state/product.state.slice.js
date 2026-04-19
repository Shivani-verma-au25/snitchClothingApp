import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name :"product",
    initialState : {
        sellerProducts : [],
        productLoading : false,
        products : []
    },
    reducers : {
        setSellerProduct : (state ,action)=>{
            state.sellerProducts = action.payload;
        },

        setProductLoading : (state ,action) =>{
            state.productLoading = action.payload;
        },
        setProducts : (state , action) =>{
            state.products = action.payload;
        }
    }
})


export const {setSellerProduct,setProductLoading,setProducts} = productSlice.actions;
export default productSlice.reducer;