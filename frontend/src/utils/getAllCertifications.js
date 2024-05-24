import axios from '../api/axios';

const getAllCertifications = async () => {
  try {
    const { data } = await axios.get(`/certifications`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getAllCertifications;
