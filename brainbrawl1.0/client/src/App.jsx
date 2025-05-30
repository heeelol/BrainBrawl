import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Navbar_2 from "./components/Navbar_2.jsx";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import {UserContextProvider} from '../context/userContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Quiz from "./pages/Quiz.jsx";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true; // Enable sending cookies with requests

function App() {  return (
    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path="/" element={<>
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar_2 />
                </div>
            </header>
            <Home />
        </>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<>
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar />
                </div>
            </header>
          <Dashboard />
        </>} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </UserContextProvider> 
  )
}

export default App;
