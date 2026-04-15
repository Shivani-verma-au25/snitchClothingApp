import axios from 'axios'

const authApiInstance = axios.create({
    baseURL : 'http://localhost:3000/api/v1/auth',
    withCredentials : true
});

export const register = async (userData) =>{
    const response = await authApiInstance.post('/register', userData)
    return response.data
}