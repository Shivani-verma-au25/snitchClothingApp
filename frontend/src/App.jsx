import { Route, Routes } from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'
import toast, { Toaster } from 'react-hot-toast';
import AddProduct from './features/products/pages/AddProduct';
import Dashboard from './features/products/pages/Dashboard';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './features/auth/hooks/useAuth';
import { useEffect } from 'react';
import Home from './features/products/pages/Home';


function App() {
  const {handleGetMe} = useAuth();
  

  useEffect(() => {
        handleGetMe();
    } ,[])
  

  return (
    <>
      <Routes>
        <Route path='/' element={ <Home/> }/>
        <Route path ='/register' element={<Register />} />
        <Route path ='/login' element={<Login />} />


        // seller
        <Route path="/seller/add-product" element={
          <ProtectedRoute role='seller' > <AddProduct/> </ProtectedRoute>
        } />
        <Route path="/seller/dashboard" element={
          <ProtectedRoute role='seller' ><Dashboard/></ProtectedRoute>} />
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
