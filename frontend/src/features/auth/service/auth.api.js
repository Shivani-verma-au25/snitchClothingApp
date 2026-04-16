import axios from 'axios'

const authApiInstance = axios.create({
    baseURL : 'http://localhost:3000/api/v1/auth',
    withCredentials : true
});

// register function to create new user
export const register = async (userData) =>{
    const response = await authApiInstance.post('/register', userData)
    return response.data
}


// login function to authenticate user and get token
export const login = async ( userData) => {
    const response = await authApiInstance.post('/login',userData);
    return response.data;
}