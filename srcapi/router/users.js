const express = require('express');
const { OAuth2Client } = require('google-auth-library');
//TODO: Should come from environment variables
const client = new OAuth2Client('455628630102-enaehlsu2qqjd09s4iguiod5edtkvj73.apps.googleusercontent.com');
const router = express.Router();
const userController = require('../dbconn/user.js')
const jwtMiddleware = require('../public/jwtMiddleware.js')

router.get('/users', async function (req, res, next) {
    res.send(await userController.getAll())
})

router.get('/users/auth', jwtMiddleware.confJWT, function (req, res, next) {
    console.log(req.user);
    res.send("Authenticated")
    next();
})

router.post('/users/GoogleSSO', async function (req, res, next) {
    let authenticatedUser = await verifyGoogleIdToken(req.headers.authorization);

    if (authenticatedUser) {
        let user = await userController.getByEmail(authenticatedUser.email);
        if (!user) {
            user = await userController.create(authenticatedUser.email, authenticatedUser.name)
        }

        res.json({
            token: jwtMiddleware.generateJwtToken(user.email, user.name, user._id)
        })
    }
    else {
        res.send('Invalid Google SSO Token');
    }
    next();
})

/**
 * Verify if the token provided from Google SSO is valid.
 * @param {*} idToken 
 */
async function verifyGoogleIdToken(idToken) {
    const verifedUser = await client.verifyIdToken({
        idToken: idToken,
        // audience: '[ClientId]',  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = verifedUser.getPayload();

    if (payload)
        return payload;
    else
        return null;
}


module.exports = router;