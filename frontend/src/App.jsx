import { Route, Routes } from 'react-router'
import Register from './features/auth/pages/Register'

function App() {

  return (
    <Routes>
      <Route path='/' element={ <h1>Hello world</h1> }/>
      <Route path ='/register' element={<Register />} />
    </Routes>
  )
}

export default App
