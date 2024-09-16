import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import AppRoutes from './AppRoutes'


const App: React.FC = () => {
  return (
    <div>
        <Navbar/>
        <AppRoutes/>
    </div>
  )
}

export default App
