export const api = (
    path,
    method = "GET",
    body = null,
    credentials = null
    ) => {
    // testing on local machine
    const url = `http://localhost:5000/api` + path;

    // For hosting the full stack app on railway
    // const url = `https://fullstack-app-react-and-rest-api-production.up.railway.app/api` + path;

    const options = {
        method,
        headers: {}
    }

    if (body) {
        options.body = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json; charset=utf-8";
    }

    // btoa() is a global js function that creates a base 64 endoded ASCII string from a string of data
    // basic authentication (node.js module: basic-auth) requires the username and password to be separated by ":"
    if (credentials) {
        const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);

        options.headers["Authorization"] = `Basic ${encodedCredentials}`
    }
    return fetch (url, options);
};