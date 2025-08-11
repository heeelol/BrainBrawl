import './App.css'
import {Routes, Route, useParams} from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import Multiplayer from "./pages/Multiplayer.jsx"; 
import Leaderboard from "./pages/Leaderboard";
import LoggedInProtect from "./components/LoggedInProtect.jsx";
import Insights from "./pages/Insights.jsx";
import Shop from "./pages/Shop.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About.jsx";
import {ContactUs} from "./pages/ContactUs.jsx";

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

function QuizWithTopic() {
    const { topic } = useParams();
    return <Quiz topic={topic} />;
}

function App() {
  return (    <UserContextProvider>
      <Toaster position='bottom-right' toastOptions={{duration: 2000}} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<>
            <PageTitle title="Home" />
            <header className="sticky top-0 z-50 flex justify-center items-center">
                <div className="xl:max-w-full w-full">
                    <Navbar_2 />
                </div>
            </header>
            <Home />
        </>} />
        <Route path="/about" element={<>
           <PageTitle title="About" />
           <header className="sticky top-0 z-50 flex justify-center items-center">
               <div className="xl:max-w-full w-full">
                    <Navbar_2 />
              </div>
           </header>
           <About />
        </>} />
          <Route path="/contact-us" element={<>
              <PageTitle title="Contact Us" />
              <header className="sticky top-0 z-50 flex justify-center items-center">
                  <div className="xl:max-w-full w-full">
                      <Navbar_2 />
                  </div>
              </header>
              <ContactUs />
          </>} />
        <Route path="/login" element={<>
          <LoggedInProtect>
            <PageTitle title="Login" />
            <Login />
          </LoggedInProtect>
        </>} />
        <Route path="/register" element={<>
          <LoggedInProtect>
            <PageTitle title="Register" />
            <Register />
          </LoggedInProtect>
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
        <Route path="/quiz/:topic" element={
          <ProtectedRoute>
            <QuizWithTopic />
          </ProtectedRoute>
        } />
        <Route path="/multiplayer" element={
          <ProtectedRoute>
              <PageTitle title="Quiz - Multiplayer" />
              <Multiplayer />
          </ProtectedRoute>
        } />
         <Route path="/leaderboard" element={ 
          <ProtectedRoute>
            <>
              <PageTitle title="Leaderboard" />
              <header className="sticky top-0 z-50 flex justify-center items-center">
                    <div className="xl:max-w-full w-full">
                        <Navbar />
                    </div>
                </header>
                <Leaderboard />
            </>
          </ProtectedRoute>} />
          <Route path="/shop" element={
            <ProtectedRoute>
                <>
                <PageTitle title="Shop" />
                <header className="sticky top-0 z-50 flex justify-center items-center">
                    <div className="xl:max-w-full w-full">
                        <Navbar />
                    </div>
                </header>
                <Shop />
                </>
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute>
              <>
              <PageTitle title="Insights"/>
              <header className="sticky top-0 z-50 flex justify-center items-center">
                    <div className="xl:max-w-full w-full">
                        <Navbar />
                    </div>
              </header>
              <Insights />
              </>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <>
              <PageTitle title="Profile"/>
              <Profile />
              </>
            </ProtectedRoute>
          } />
      </Routes>
    </UserContextProvider> 
  )
}

export default App;
