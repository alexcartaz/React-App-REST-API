/**
 * Catch all error handler
 * 
 * @returns Unexpected error message
 */

const UnhandledError = () => (
    <div className="wrap">
        <h2>Unhandled Error</h2>
        <p>An unexpected error has occured.</p>
    </div>
);

export default UnhandledError;