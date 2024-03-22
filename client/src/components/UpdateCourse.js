import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { api } from "../utils/apiHelper";

import ValidationErrors from "./ValidationErrors";
import UserContext from "./context/UserContext";
import NotFound from "./NotFound";

/**
 * User can update course detail information (IF they are the course creator)
 * 
 * Primary Actions:
 * -Update
 * -Cancel
 * 
 * Will render validation errors if the backend provides any to the PUT request
 * 
 * @returns UpdateCourse component
 */

const UpdateCourse = () => {
    const { authUser } = useContext(UserContext);
    const { id } = useParams();
    const [course, setCourse] = useState();
    const navigate = useNavigate();

    // grab existing course detail information from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api(`/courses/${id}`, 'GET')
                const json = await response.json();
                if (response.status === 200) {
                    setCourse(json);
                }
            } catch (error) {
                console.log(`Error fetching and parsing the data`, error);
            }
        }
        fetchData();
    }, [id])

    // initialize state
    const title = useRef(null)
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

        // generate PUT request to update course
        try {
            const response = await api(`/courses/${id}`, 'PUT', course, authUser);
            if (response.status === 204) {
                navigate(`/courses/${id}`);
            } else if (response.status === 403) {
                navigate(`/forbidden`);
            } else if (response.status === 500) {
                navigate(`/error`);
            } else {
                const data = await response.json();
                setErrors(data.errors)
            }
            
        } catch (error) {
            console.log(error);
            navigate('/error');
            
        }
    };

    const handleCancel = (event) => {
        event.preventDefault();
        navigate(`/courses/${id}`);
    }
    

    if (course) {
        // navigate to forbidden if the current user is not the course owner
        // it's unclear how this would happen, given the update button is only conditionally shown
        // when this is already true, but a redundant check just in case
        if (authUser.id !== course.User.id) {
            return (
                <Navigate to='/forbidden'/>
            )
        } else {
            // permission granted: generate update form
            return (
                <div className="wrap">
                    <h2>Update Course</h2>
                    <ValidationErrors errors={errors}/>
                    <form onSubmit={handleSubmit}>
                        <div className="main--flex">
                            <div>
                                <label htmlFor="courseTitle">Course Title</label>
                                <input id="courseTitle" name="courseTitle" type="text" ref={title} defaultValue={course.title} />
        
                                <p>By {course.User.firstName} {course.User.lastName}</p>
        
                                <label htmlFor="courseDescription">Course Description</label>
                                <textarea id="courseDescription" name="courseDescription" ref={description} defaultValue={course.description} />
                            </div>
                            <div>
                                <label htmlFor="estimatedTime">Estimated Time</label>
                                <input id="estimatedTime" name="estimatedTime" type="text" ref={estimatedTime} defaultValue={course.estimatedTime} />
        
                                <label htmlFor="materialsNeeded">Materials Needed</label>
                                <textarea id="materialsNeeded" name="materialsNeeded" ref={materialsNeeded} defaultValue={course.materialsNeeded} />
                            </div>
                        </div>
                        <button className="button" type="submit">Update Course</button>
                        <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            );
        }
    } else {
        return (
            <NotFound />
        );
    }

};

export default UpdateCourse;