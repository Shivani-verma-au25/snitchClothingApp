import {createSlice} from '@reduxjs/toolkit'

const productSlice = createSlice({
    name :"product",
    initialState : {
        sellerProducts : [],
        productLoading : false
    },
    reducers : {
        setSellerProduct : (state ,action)=>{
            state.sellerProducts = action.payload;
        },

        setProductLoading : (state ,action) =>{
            state.productLoading = action.payload;
        },
    }
})


export const {setSellerProduct,setProductLoading} = productSlice.actions;
export default productSlice.reducer;