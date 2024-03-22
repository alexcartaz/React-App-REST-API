/** 
 * ValidationErrors is a catch all for validation errors within our client
 * 
 * Covered functionality includes:
 * -Update Course
 * -Create Course
 * -Sign Up
 * -Sign In
 * 
 * The backend provides the validation error text
 * 
 * @param {object} errors 
 * @returns component list of errors
 */

const ValidationErrors = ({ errors }) => {
    let errorList = null;

    if (errors.length) {
        errorList = (
            <div className="validation--errors">
                <h3>Validation Errors</h3>
                <ul>
                    {errors.map((error, i) => (
                        <li key={i}>{error}</li>
                    ))}
                </ul>
            </div>
        )
    }
    return errorList;
}

export default ValidationErrors;