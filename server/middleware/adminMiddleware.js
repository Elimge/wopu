/**
 * File: server/middleware/adminMiddleware.js
 * Description: Middleware to protect routes by verifying user role is 'admin'.
 * This should be used AFTER the standard authMiddleware.
 */
function adminMiddleware(req, res, next) {
    // req.user is attached by the preceding authMiddleware
    if (req.user && req.user.role === 'admin') {
        next(); // The user is an admin, proceed to the controller
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
}

module.exports = adminMiddleware;