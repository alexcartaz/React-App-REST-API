import { useContext, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { api } from "../utils/apiHelper";
import ValidationErrors from "./ValidationErrors";
import UserContext from "./context/UserContext";

/**
 * Enables an authenticated user to create a new course
 * 
 * Renders page / form per the mockup specs that allows a user to enter
 * the appropriate information to create a new course
 * 
 * Primary Actions:
 * -Create
 * -Cancel
 * 
 * @returns CreateCourse component
 */

const CreateCourse = () => {
    const { authUser } = useContext(UserContext);
    const navigate = useNavigate();

    // init state
    const title = useRef(null);
    const description = useRef(null);
    const estimatedTime = useRef(null);
    const materialsNeeded = useRef(null);
    const [errors, setErrors] = useState([]);

    // event handlers: submit, cancel
    const handleSubmit = async (event) => {
        event.preventDefault();

        const course = {
            userId: authUser.id,
            title: title.current.value,
            description: description.current.value,
            estimatedTime: estimatedTime.current.value,
            materialsNeeded: materialsNeeded.current.value,
        };


        // attempts to POST new course to backend; redirects to that course detail page if successful
        try {
            const response = await api('/courses', 'POST', course, authUser);
            if (response.status === 201){
                const path = response.headers.get('Location')
                navigate(path)
            } else if (response.status === 400){
                const data = await response.json();
                setErrors(data.errors)
            } else if (response.status === 500) {
                navigate(`/error`);
            } else {
                throw new Error();
            }
            
        } catch (error) {
            console.log(error);
            navigate('/error');
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        navigate('/');
    }

    return (
        <div className="wrap">
            <h2>Create Course</h2>
            <ValidationErrors errors={errors} />
            <form onSubmit={handleSubmit}>
                <div className="main--flex">
                    <div>
                        <label htmlFor="courseTitle">Course Title</label>
                        <input id="courseTitle" name="courseTitle" type="text" ref={title} defaultValue="" />

                        <p>By {authUser.firstName} {authUser.lastName}</p>

                        <label htmlFor="courseDescription">Course Description</label>
                        <textarea id="courseDescription" name="courseDescription" ref={description}></textarea>
                    </div>
                    <div>
                        <label htmlFor="estimatedTime">Estimated Time</label>
                        <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} defaultValue="" />

                        <label htmlFor="materialsNeeded">Materials Needed</label>
                        <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded}></textarea>
                    </div>
                </div>
                <button className="button" type="submit">Create Course</button>
                <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default CreateCourse;