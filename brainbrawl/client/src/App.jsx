import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Navbar from './components/Navbar'
//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    // TODO: Implement JWT token storage
    setUser(userData)
  }

  return (
    <div className="app">
      {!user ? (
          <>
            <Navbar />
            <Login onLogin={handleLogin} />
          </>
      ) : (
        <div className="game-container">
          <h1>Welcome to Brain Brawl, {user.username}!</h1>
          {/* TODO: Add game components here */}
        </div>
      )}
    </div>
  )
}

export default App