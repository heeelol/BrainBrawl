import './App.css'
import {Routes, Route} from 'react-router-dom';
import Navbar from '../src/components/Navbar.jsx';
import Navbar_2 from "./components/Navbar_2.jsx";
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/Error404.jsx';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import {UserContextProvider} from '../context/userContext.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Quiz from "./pages/Quiz.jsx";
import PageTitle from "./components/PageTitle.jsx";
import ProtectedRoute from './components/ProtectedRoute'; // Add this import

axios.defaults.baseURL = 'https://brainbrawl-backend-bw7x.onrender.com';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<>
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar_2 />
                </div>
            </header>
            <Home />
        </>} />
        <Route path="/login" element={<>
            <PageTitle title="Login" />
            <Login />
        </>} />
        <Route path="/register" element={<>
            <PageTitle title="Register" />
            <Register />
        </>}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <>
              <PageTitle title="Dashboard" />
              <header className="sticky top-0 z-50 flex justify-center items-center">
                  <div className="xl:max-w-full w-full">
                      <Navbar />
                  </div>
              </header>
              <Dashboard />
            </>
          </ProtectedRoute>
        } />
        <Route path="/quiz" element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        } />
      </Routes>
    </UserContextProvider> 
  )
}

export default App;
