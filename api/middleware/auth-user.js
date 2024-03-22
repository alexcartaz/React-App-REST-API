'use strict';

// Library to help parse the user's credentials from the Authorization header
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');


/**
 * middleware for basic authentication.
 * exported so other modules can import it
 * 
 */
exports.authenticateUser = async (req, res, next) => {
    // store the message to display
    let message;

    // grab user's credentials from authorization header
    // credentials set to an object with the user's key and secret
    const credentials = auth(req);

    // if credentials are available...
        // try to retrieve the user from the database via username
        // e.g. a user's "key" from authorization header
    if (credentials) {
        // since email is the unique in the database, findOne
        const user = await User.findOne({ where: { emailAddress: credentials.name }});

        // if a user is found...
            // use bcryptjs to compare user password from header with password in db
        if (user) {
            // compareSync() will hash the user's pw before comparing it to the stored hash in the db
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);

            // if valid...
                // store the user object on the request object
            if (authenticated) {
                console.log(`Auth successful for user: ${user.emailAddress}`);

                // add a property named currentUser to the Request object and set it to the authenticated user
                req.currentUser = user;
            } else {
                message = `Auth failed for user: ${user.emailAddress}`;
            }
        } else {
            message = `User not found: ${credentials.name}`;
        }
     } else {
        message = `Auth header not found`;
     }

    // if authentication failed...
        // return 401 Unauthorization HTTP status code
        // if success...
            // next()
    if (message) {
        console.warn(message);
        // Generic message is intentionally vague to NOT help potential hackers
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};