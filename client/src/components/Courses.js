import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from '../utils/apiHelper'


/**
 * Grabs all courses from the /api/courses endpoint
 * 
 * Primary Actions:
 * -click on a course to navgiate to its detailed view
 * 
 * Create Course button is also rendered; 
 * @returns Courses component
 */

const Courses = () => {
    const [courses, setCourses] = useState(null);
    const navigate = useNavigate();

    // call to /api/courses endpoint  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api('/courses', 'GET')
                const json = await response.json();
                if (response.status === 200) {
                    setCourses(json)
                } else if (response.status === 500) {
                    navigate(`/error`);
                }
            } catch (error) {
                console.log(`Error fetching and parsing data`, error)
                navigate('/error');
            }
        }
        fetchData();
    },[navigate]);
   

    let courseList;

    if (courses) {
        courseList = courses.map( course => 
            <a className="course--module course--link" href={'/courses/' + course.id} key={course.id}>
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{course.title}</h3>
            </a>
        )
    } else {
        courseList = <h2>No courses found</h2>
    }
        
    return (
        <div className="wrap main--grid">
            {courseList}
            <a className="course--module course--add--module" href= '/courses/create'>
                <span className="course--add--title">
                    +  New Course
                </span>
            </a>
        </div>
    );
}



export default Courses;