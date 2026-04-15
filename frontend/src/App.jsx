import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { Route, Routes } from 'react-router'

function App() {

  return (
    <Routes>
      <Route path='/' element={ <h1>Hello world</h1> }/>
    </Routes>
  )
}

export default App
