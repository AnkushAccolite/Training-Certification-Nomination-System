import { jwtDecode } from 'jwt-decode';

const parseUser = (token) => {
  const decoded = jwtDecode(token);
  const user = { email: decoded.email, role: decoded.role[0] };

  return user;
};

export default parseUser;
