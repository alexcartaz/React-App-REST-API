import { useContext, useRef, useState } from "react";
import { useNavigate, useLocation} from 'react-router-dom'

import ValidationErrors from "./ValidationErrors";
import UserContext from "./context/UserContext";

/**
 * Generates a sign in form
 * 
 * Primary Actions:
 * -Sign In
 * -Cancel
 * 
 * @returns UserSignIn component
 */

const UserSignIn = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();


    // initialize state
    const emailAddress = useRef(null);
    const password = useRef(null);
    const [ errors, setErrors ] = useState([]);

    // event handlers: submit, cancel
    const handleSubmit = async (event) => {
        event.preventDefault();

        // redirect user back to previous app location before needing to sign in 
        let from = '/'
        if (location.state) {
            from = location.state.from
        }

        // setting credentials so signIn can be called
        const credentials = {
            emailAddress: emailAddress.current.value,
            password: password.current.value
        }

        try {
            const user = await actions.signIn(credentials);
            if (user){
                navigate(from);
            } else {
                setErrors([`Sign in was unsuccessful`])
            }
        } catch (error) {
            console.log(error);
            navigate('/error');
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        // navigate back to root if user clicks 'cancel'
        navigate('/');
    }

    return (
        <div className="form--centered">
            <h2>Sign In</h2>
            <ValidationErrors errors={errors}/>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emailAddress">Email Address</label>
                <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} defaultValue="" />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" ref={password} defaultValue="" />
                <button className="button" type="submit" >Sign In</button>
                <button className="button button-secondary" onClick={handleCancel} >Cancel</button>
            </form>
        </div>
    );
};

export default UserSignIn;