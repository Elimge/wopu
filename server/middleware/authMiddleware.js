
/**
 * File: server/middleware/authMiddleware.js
 * 
 * This middleware is responsible for protecting routes by verifying the JWT token.
 * It checks for the token in the Authorization header, validates it, and attaches
 * the user payload to the request object if the token is valid.
 */
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    // The token is expected to be in the format "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token format is invalid, authorization denied.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload to the request object
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid.' });
    }
}

module.exports = authMiddleware;
