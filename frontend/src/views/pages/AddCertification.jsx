import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, Button, Select, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import { Category } from '@mui/icons-material';

const AddCertification = ({ onCourseAdd }) => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'ADMIN')) navigate('/login');
  }, []);

  const [formData, setFormData] = useState({
    certificationname: '',
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
        name: formData.certificationname,
        duration: formData.duration,
        category: formData.domain,
        description: formData.description
      };

      const res = await axios.post('/certifications', newCourse);
      setFormData({
        certificationname: '',
        duration: '',
        category: '',
        description: ''
      });
      toast.success('Certification added successfully');
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
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>ADD CERTIFICATION</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="certificationname">Certification Name</InputLabel>
          <OutlinedInput
            id="certificationname"
            type="text"
            name="certificationname"
            value={formData.certificationname}
            onChange={handleChange}
            label="Certification Name"
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
          Add Certification
        </Button>
      </form>
    </Box>
  );
};
export default AddCertification;
