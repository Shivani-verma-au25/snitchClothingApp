import { useDispatch } from "react-redux";
import { register } from "../service/auth.api";
import { setError, setLoading, setUser } from "../state/auth.slice";



export const useAuth = () =>{
    const dispatch = useDispatch()

    const handleregister = async (userData) =>{
        try {
            dispatch(setLoading(true))
            const response = await register(userData)
            console.log("userdata" , response);
            dispatch(setUser(response))
            dispatch(setLoading(false))

            return response
            
        } catch (error) {
            dispatch(setLoading(false))
            dispatch(setError(error.message))
            console.log("error" , error);
            return error
        }
    }
    


    return {
        handleregister
    }
}
