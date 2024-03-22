import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { api } from "../../utils/apiHelper";

const UserContext = createContext(null);

/**
 * Manage global state of the app with the React Context API
 * 
 * The <Provider> component wraps the <App> component and manages the global state of the app
 * including authUser data (if there is any), as well as signIn and signOut actions
 * 
 * @param {object} props 
 * @returns Context API Provider component
 */

export const UserProvider = (props) => {
    const navigate = useNavigate();
    const cookie = Cookies.get('authenticatedUser');
    // if there is no cookie for a user, we initialize authUser state to null (no signed in user)
    const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null);

    const signIn = async (credentials) => {
        const response = await api('/users', 'GET', null, credentials);
        if (response.status === 200){
            const user = await response.json();
            user.password = credentials.password;
            // set state
            setAuthUser(user);
            // set cookie -- 1 day duration
            Cookies.set("authenticatedUser", JSON.stringify(user), {expires: 1})
            return user
        } else if (response.status === 401) {
            return null
        } else if (response.status === 500) {
            navigate('/error')
        } else {
            throw new Error()
        }
    }

    const signOut = () => {
        setAuthUser(null);
        Cookies.remove('authenticatedUser');
    }

    return (
        <UserContext.Provider value={{
            authUser,
            actions: {
                signIn,
                signOut
            }
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContext;