import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Markdown from 'react-markdown';

import { api } from "../utils/apiHelper";
import UserContext from "./context/UserContext";
import NotFound from './NotFound';

/**
 * Renders "Course Details" view by retreiving data from
 * the REST API's /api/courses/:id end point
 * 
 * Primary Actions:
 * -Return to List (navigate back to home)
 * -Update (only if course owner)
 * -Delete (only if course owner)
 * 
 * @returns CourseDetail component
 */

const CourseDetail = () => {
    const { authUser } = useContext(UserContext);
    const { id } = useParams();
    const [course, setCourse] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api(`/courses/${id}`, 'GET')
                const json = await response.json();
                if (response.status === 200) {
                    setCourse(json);
                } else if (response.status === 500) {
                    navigate(`/error`);
                }
            } catch (error) {
                console.log(`Error fetching and parsing data`, error)
                navigate('/error');
            }
        }
        fetchData();
    }, [id, navigate])

    // event handler for delete course
    const handleDelete = async (event) => {
        event.preventDefault();
        const response = await api(`/courses/${id}`, 'DELETE', null, authUser);
        if (response.status === 204) {
            console.log(`Successfully deleted your course`)
            navigate(`/`)
        } else if (response.status === 500) {
            navigate(`/error`);
        }
        try {
        } catch(error) {
            console.log(error)
            navigate('/error');
        }
    }

    if (course) {
        let listMaterials;
        if (course.materialsNeeded){
            listMaterials = course.materialsNeeded;
        } else {
            listMaterials = '* Ask instructor';
        }

        return (
            <>
                <div className="actions--bar">
                    <div className="wrap">
                        {/* if a user is logged in AND if they created the course, conditional update/delete options are added; otw omitted */}
                        { authUser && authUser.id === course.User.id  ?
                        <>
                        <a className="button" href={`/courses/${id}/update`}>Update Course</a>
                        <button className='button' onClick={handleDelete}>Delete Course</button>
                        </>
                        :
                        null
                        }
                        <a className="button button-secondary" href="/">Return to List</a>
                    </div>
                </div>
                
                <div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">Course</h3>
                            <h4 className="course--name">{course.title}</h4>
                                <p>By {course.User.firstName} {course.User.lastName}</p>

                                <Markdown>{course.description}</Markdown>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                <p>{course.estimatedTime || 'Ask instructor'}</p>

                                <h3 className="course--detail--title">Materials Needed</h3>
                                <ul className="course--detail--list">
                                <Markdown>{listMaterials}</Markdown>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>

            </>
        );

    } else {
        return (
            <NotFound />
        );
    }

}

export default CourseDetail;