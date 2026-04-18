import { Route, Routes } from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import toast, { Toaster } from 'react-hot-toast';
import AddProduct from './features/products/pages/AddProduct';
import Dashboard from './features/products/pages/Dashboard';


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={ <h1>Hello world</h1> }/>
        <Route path ='/register' element={<Register />} />
        <Route path ='/login' element={<Login />} />


        // seller
        <Route path="/seller/add-product" element={<AddProduct/>} />
        <Route path="/seller/dashboard" element={<Dashboard/>} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
