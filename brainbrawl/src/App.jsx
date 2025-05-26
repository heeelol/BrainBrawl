import { useState } from 'react'
import './App.css'
import Login from './components/Login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="app">
      {!isLoggedIn ? <Login /> : <h1>Brain Brawl Game</h1>}
    </div>
  )
}

export default App