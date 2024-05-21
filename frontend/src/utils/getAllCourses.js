import axios from '../api/axios';

const getAllCourses = async () => {
  try {
    const { data } = await axios.get(`/course`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getAllCourses;
