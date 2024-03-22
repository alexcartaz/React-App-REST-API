import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import UserContext from "./context/UserContext";

/**
 * Higher-Order React Component guarding authenticated functionality
 * 
 * Grants access to protected pages if there is a logged in user (authUser)
 * 
 * <Outlet /> allows for the rendering of child route elements
 * 
 * @returns Navigation to allowed (conditional) paths
 */
const PrivateRoute = () => {
    const { authUser } = useContext(UserContext);
    const location = useLocation();

    if (authUser) {
        return <Outlet />
    } else {
        // can save the location of where the user tried to naviage to in the state property
        return <Navigate to='/signin' state={{from: location.pathname}} />
    }

};

export default PrivateRoute;