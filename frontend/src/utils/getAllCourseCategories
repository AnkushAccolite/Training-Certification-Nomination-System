import axios from '../api/axios';

const getAllCourseCategories = async () => {
  try {
    const { data } = await axios.get(`/course/categories`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getAllCourseCategories;
