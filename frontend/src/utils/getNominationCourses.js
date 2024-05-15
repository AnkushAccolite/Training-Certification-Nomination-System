import axios from '../api/axios';

const getNominationCourses = async (empId) => {
  try {
    const { data } = await axios.get(`/employee/status?empId=${empId}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getNominationCourses;
