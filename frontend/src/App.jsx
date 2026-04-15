import { Route, Routes } from 'react-router'
import Register from './features/auth/pages/Register'
import Login from './features/auth/pages/Login'

function App() {

  return (
    <Routes>
      <Route path='/' element={ <h1>Hello world</h1> }/>
      <Route path ='/register' element={<Register />} />
      <Route path ='/login' element={<Login />} />
    </Routes>
  )
}

export default App
