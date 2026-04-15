import axios from 'axios'

const auhtApiInstance = axios.create({
    baseURL : 'http://localhost:3000/api/v1/auth',
    withCredentials : true
});

export const register = async (userData) =>{
    try {
        const response = await auhtApiInstance.post('/register',userData)
        return response.data
    } catch (error) {
        // throw error
        console.log("error from register api" , error);
        
        return error.response.data
    }
}