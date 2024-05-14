import { jwtDecode } from 'jwt-decode';

const parseUser = (token) => {
  const decoded = jwtDecode(token);
  const user = {
    email: decoded.email,
    role: decoded.role[0],
    empName: decoded.empName,
    managerId: decoded.managerId,
    empId: decoded.empId
  };

  return user;
};

export default parseUser;
