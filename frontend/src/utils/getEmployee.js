import axios from '../api/axios';

const getEmployee = async (email) => {
  try {
    const { data } = await axios.get(`/employee/getByEmail?email=${email}`);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default getEmployee;
