import { useDispatch } from "react-redux";
import { createProduct ,getAllProducts,getSellerProducts} from "../services/product.api";
import { setProductLoading, setProducts, setSellerProduct } from "../state/product.state.slice";

export const useProducts = () =>{

    const dispatch = useDispatch()
    const handleCreateProduct = async (formData) =>{
        dispatch(setProductLoading(true));
        try {
            const res = await createProduct(formData);
            console.log("res" ,res);
            
            if (res?.success) {
                dispatch(setSellerProduct(res))
            }
            return res;
        } catch (error) {
            console.log("Error while creating products in  hook" , error);
            dispatch(setProductLoading(false))
            
        }finally{
            dispatch(setProductLoading(false))
        }

    };

    const handleGetSellerProduct = async () =>{
        dispatch(setProductLoading(true));
        try {
            const res = await getSellerProducts();
            console.log(res.data);
        
            if (res?.success) {
                dispatch(setSellerProduct(res?.data));
            }
            return res;
        } catch (error) {
           console.log("getting error in useproduct",error);
            return error
        }finally{
            dispatch(setProductLoading(false))
        }
    };

    const handleGetAllProducts = async () =>{
        dispatch(setProductLoading(true));
        try {
            const resp = await getAllProducts();
            if (resp?.success) {
                dispatch(setProducts(resp?.data))
            };
            return resp;
        } catch (error) {
            console.log("error in handle get products" , error.message);
            dispatch(setProductLoading(false));
            dispatch(setProducts([]))
        }finally{
            dispatch(setProductLoading(false));
        };
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
    }
}