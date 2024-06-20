import axios from '../api/axios';

const getAllCertCategories = async () => {
  try {
    const { data } = await axios.get(`/certifications/categories`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getAllCertCategories;
