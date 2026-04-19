import axios from 'axios'

const authApiInstance = axios.create({
    baseURL : '/api/auth',
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


// get me funnction for authorized user

export const getMe = async () => {
    const resp = await authApiInstance.get('/getme');
    return resp.data;
}