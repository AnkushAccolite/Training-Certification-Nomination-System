import axios from 'axios';
import { getToken } from 'utils/verifyToken';

axios.defaults.baseURL = 'http://localhost:8080';

// if (getToken() !== 'No_Valid_Token_Found') {
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Authorization'] = `Bearer ${getToken()}`;
// }
// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default axios;
