/**
 * File: app/utils/jwt.js
 * Description: Provides utility functions for handling JWTs on the client-side.
 */

/**
 * Decodes a JWT token to extract its payload without verifying the signature.
 * @param {string} token - The JWT token string.
 * @returns {object|null} The decoded payload object, or null if the token is invalid.
 */
export function decodeToken(token) {
    if (!token) {
        return null;
    }
    try {
        // A JWT is composed of three parts separated by dots: header.payload.signature
        const payloadBase64 = token.split('.')[1];
        if (!payloadBase64) {
            return null;
        }
        const decodedPayload = atob(payloadBase64); // Decode from Base64
        return JSON.parse(decodedPayload);         // Parse the JSON string
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
}