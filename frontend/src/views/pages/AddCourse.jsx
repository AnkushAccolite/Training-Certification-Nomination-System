import React, { useState } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, Button } from '@mui/material';
const AddCourse = ({ onCourseAdd }) => {
  const [formData, setFormData] = useState({
    coursename: '',
    duration: '',
    domain: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct the new course object
    const newCourse = {
      id: Date.now(), // Generate a unique id (using current timestamp)
      coursename: formData.coursename,
      duration: formData.duration,
      domain: formData.domain
    };
    // Pass the new course object to the parent component
    onCourseAdd(newCourse);
    // Reset form data after submission
    setFormData({
      coursename: '',
      duration: '',
      domain: ''
    });
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
        boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>ADD COURSE FORM</h2>
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
          <InputLabel htmlFor="domain">Domain</InputLabel>
          <OutlinedInput
            id="domain"
            type="text"
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            label="Domain"
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