import {useContext, useEffect, useRef} from "react";
import {UserContext} from "../../context/userContext.jsx";
import {Navigate, useLocation} from "react-router-dom";
import {toast} from "react-hot-toast";

const LoggedInProtect = ({ children }) => {
    const { user, loading } = useContext(UserContext);
    const toastShown = useRef(false);
    const prevUser = useRef(user);
    const location = useLocation();

    // useEffect(() => {
    //     // Only show toast if user is not logged in, not loading, and wasn't just logged out
    //     if (!user && !loading && !toastShown.current && prevUser.current !== null) {
    //         toast.error('You must be logged in to access this page');
    //         toastShown.current = true;
    //     }
    //     prevUser.current = user;
    // }, [user, loading, location.pathname]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-indigo-400 text-xl">Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default LoggedInProtect;