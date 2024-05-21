import { jwtDecode } from 'jwt-decode';

// Function to check if a token is expired
export function isTokenExpired(token) {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // If there's an error decoding the token, consider it expired
  }
}

// Function to get the token (from localStorage, sessionStorage, or cookie)
export function getToken() {
  // Example: getting the token from localStorage
  const token = localStorage.getItem('token');
  if (token && !isTokenExpired(token)) return token;
  return 'No_Valid_Token_Found';
}
