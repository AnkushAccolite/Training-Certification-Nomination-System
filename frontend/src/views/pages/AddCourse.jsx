import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, Button, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const AddCourse = ({ onCourseAdd }) => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'ADMIN')) navigate('/login');
  }, [auth, navigate]);

  const [formData, setFormData] = useState({
    coursename: '',
    duration: '',
    category: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const newCourse = {
        courseName: formData.coursename,
        duration: formData.duration,
        category: formData.domain,
        description: formData.description,
        isApprovalReq: true
      };

      const res = await axios.post('/course', newCourse);
      setFormData({
        coursename: '',
        duration: '',
        category: '',
        description: ''
      });
      toast.success('Course added Sucessfully');
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 600,
        margin: '0 auto',
        padding: 7,
        border: '1px solid #ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)'
      }}
    >
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>ADD COURSE</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="coursename">Course Name</InputLabel>
          <OutlinedInput
            id="coursename"
            type="text"
            name="coursename"
            value={formData.coursename}
            onChange={handleChange}
            label="Course Name"
            required
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="duration">Duration</InputLabel>
          <OutlinedInput
            id="duration"
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            label="Duration"
            required
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="domain">Category</InputLabel>
          <Select id="domain" name="domain" value={formData.domain} onChange={handleChange} label="Domain" required>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Domain">Domain</MenuItem>
            <MenuItem value="Power">Power</MenuItem>
            <MenuItem value="Process">Process</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="description">Description</InputLabel>
          <OutlinedInput
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            label="Description"
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          Add Course
        </Button>
      </form>
    </Box>
  );
};

export default AddCourse;
