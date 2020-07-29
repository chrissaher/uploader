const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

/**
 * Method that will setup the middleware for JWT Tokens on the requests
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const confJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                //Invalid token (like expired token)
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        //User is not authenticated
        res.sendStatus(401);
    }
};


/**
 * Method that will generate a JWT Token to authenticate the user for new requests
 * @param {*} email 
 * @param {*} name 
 * @returns the jwt token
 */
exports.generateJwtToken = (email, name, id) => {

    //https://github.com/auth0/node-jsonwebtoken

    // Generate an JWT token
    const accessToken = jwt.sign({ name: name, email: email, id: id }, accessTokenSecret, {
        audience: 'http://localhost:3000',
        issuer: 'http://localhost:3000',
        expiresIn: '2 days'
    });

    return accessToken;
}


exports.confJWT = confJWT;