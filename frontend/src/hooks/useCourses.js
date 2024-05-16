import { useState, useEffect } from 'react';
import axios from '../api/axios';

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('/course');
        setCourses(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCourses();

    // Cleanup function
    return () => {
      // Any cleanup code if necessary
    };
  }, []); // Empty dependency array to ensure useEffect runs only once

  return { courses, loading, error };
};

export default useCourses;
