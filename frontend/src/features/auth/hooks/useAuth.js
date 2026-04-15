import { useDispatch } from "react-redux";
import { register } from "../service/auth.api";
import { setError, setLoading, setUser } from "../state/auth.slice";



export const useAuth = () =>{
    const dispatch = useDispatch()

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

    


    return {
        handleRegister
    }
}
