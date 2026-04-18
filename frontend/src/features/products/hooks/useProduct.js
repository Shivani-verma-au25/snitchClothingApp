import { useDispatch } from "react-redux";
import { createProduct ,getSellerProducts} from "../services/product.api";
import { setProductLoading, setSellerProduct } from "../state/product.state.slice";

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
        const res = await getSellerProducts();
        if (res?.success) {
            dispatch(setSellerProduct(res));
        }
        return res;
    }

    return {
        handleCreateProduct,
        handleGetSellerProduct
    }
}