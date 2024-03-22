
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";

import UserContext from "./context/UserContext";

/**
 * Signs out the user
 * 
 * Primary Actions:
 * -Sign Out
 * -Navigate to root
 * 
 * @returns Navigation to root (course list)
 */

const UserSignOut = () => {
    const { actions } = useContext(UserContext);

    useEffect( () => actions.signOut());

    // replace sign out route in the nav stack with root stack; preven issues when user presses 'Back' in browser
    return <Navigate to='/' replace />
};

export default UserSignOut;