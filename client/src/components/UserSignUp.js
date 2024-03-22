import { useContext, useRef, useState } from "react";
import { useNavigate} from 'react-router-dom';

import { api } from '../utils/apiHelper';
import ValidationErrors from "./ValidationErrors";
import UserContext from "./context/UserContext";

/**
 * User Sign Up
 * 
 * Primary Actions:
 * -Sign Up
 * -Cancel
 * 
 * @returns UserSignUp component
 */

const UserSignUp = () => {
    const { actions } = useContext(UserContext);
    const navigate = useNavigate();

    // initialize state
    const firstName = useRef(null);
    const lastName = useRef(null);
    const emailAddress = useRef(null);
    const password = useRef(null);
    const [ errors, setErrors ] = useState([]);

    // event handlers: submit, cancel
    const handleSubmit = async (event) => {
        event.preventDefault();

        const user = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            emailAddress: emailAddress.current.value,
            password: password.current.value,
        }

        // attempts to POST new user to the backend; navigates to root if successful, toggles conditional error components if not
        try {
            const response = await api('/users', 'POST', user);
            if (response.status === 201) {
                console.log(`${user.firstName} ${user.lastName} is successfully signed up and authenticated!`)
                await actions.signIn(user)
                navigate('/')
            } else if (response.status === 400) {
                // if not successful, parse the resulting promise with an await and update state with error messages
                const data = await response.json();
                setErrors(data.errors);
            } else {
                throw new Error();
            }
        } catch(error) {
            console.log(error);
            navigate('/error')
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <div className="form--centered">
                <h2>Sign Up</h2>
                <ValidationErrors errors={errors}/>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" ref={firstName} defaultValue="" />
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" ref={lastName} defaultValue="" />
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" ref={emailAddress} defaultValue="" />
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" ref={password} defaultValue="" />
                    <button className="button" type="submit">Sign Up</button>
                    <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                </form>
                <p>Already have a user account? <a href="/signin">Sign in</a> here!</p>
            </div>
    );
};

export default UserSignUp;