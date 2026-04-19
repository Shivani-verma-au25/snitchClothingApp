import { useDispatch } from "react-redux";
import { getMe, login, register } from "../service/auth.api";
import { setError, setLoading, setUser } from "../state/auth.slice";



export const useAuth = () =>{
    const dispatch = useDispatch()

    // handle register function to call register api and update state accordingly
    const handleRegister = async (userData) => {
    try {
        dispatch(setLoading(true))

        const response = await register(userData)

        if (response?.success) {
            dispatch(setUser(response))
        } 

        return response

    } catch (error) {
        console.log("ERROR:", error.response?.data?.errors)

        // extract backend error message
       const errors = error.response?.data?.errors
        dispatch(setError(errors))

        return { success: false, errors }

    } finally {
        dispatch(setLoading(false))
    }
}


// login function to call login api and update state accordingly
    const handleLogin = async ( userData) => {
        try {
            setLoading(true);
            const response = await login(userData);
            if (response?.success) {
                dispatch(setUser(response?.data))
            }
            return response;
            
        } catch (error) {
            console.log("error from login api",error?.message ||  error.response?.data?.errors);
            dispatch(setError(error.response?.data?.errors))
            dispatch(setUser(null))
        }finally{
            dispatch(setLoading(false))
        }
    }


    //  get me 

    const handleGetMe = async () =>{
        dispatch(setLoading(true));
        try {
            const resp = await getMe();
            
            if (resp?.success) {
                dispatch(setUser(resp.data));
            };
            dispatch(setLoading(false));
            return resp;

        } catch (error) {
            console.log("error in handle getme" , error);
            dispatch(setUser(null));
            dispatch(setLoading(false))

            return error.message;
        }finally{
            dispatch(setLoading(false))
        }
    }
    


    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }
}
