import React, { useEffect, useState } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, MenuItem, Select, Chip, Button } from '@mui/material';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import axios from '../../api/axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300
    }
  }
};

export default function Nominate() {
  const [formData, setFormData] = useState({
    empName: '',
    empId: '',
    courses: [],
    courseSuggestions: ''
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // State for showing success alert
  const [courses, setCourses] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      courses: value
    }));
  };

  const handleSuggestionsFocus = () => {
    // Do not reset the courses field when moving to the courseSuggestions field
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const resp = await axios.post('/nomination', formData);
      setShowSuccessAlert(true);
      setFormData({
        empName: '',
        empId: '',
        courses: [],
        courseSuggestions: ''
      });
    } catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const temp = await axios.get('/course');
        setCourses(temp.data);
      } catch (err) {
        console.log('Courses Fetch Error => ', err);
      }
    };
    getCourseData();
  }, []);

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
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>NOMINATION FORM</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="employee-name">Employee Name</InputLabel>
          <OutlinedInput
            id="employee-name"
            type="text"
            name="empName"
            value={formData.empName}
            onChange={handleChange}
            label="Employee Name"
            required
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="employee-id">Employee ID</InputLabel>
          <OutlinedInput
            id="employee-id"
            type="text"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
            label="Employee ID"
            required
          />
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel id="courses-to-enroll-label">Courses to Enroll</InputLabel>
          <Select
            labelId="courses-to-enroll-label"
            id="courses-to-enroll"
            multiple
            value={formData.courses}
            onChange={handleCourseChange}
            onBlur={handleSuggestionsFocus}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            label="Courses to Enroll"
            required
          >
            {courses?.map((course) => (
              <MenuItem key={course?.courseName} value={course?.courseName}>
                {course?.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="courseSuggestions">courseSuggestions</InputLabel>
          <OutlinedInput
            id="courseSuggestions"
            multiline
            rows={4}
            name="courseSuggestions"
            value={formData.courseSuggestions}
            onChange={handleChange}
            onFocus={handleSuggestionsFocus}
            label="courseSuggestions"
            required
          />
        </FormControl>
        {/* Other form fields */}
        <Button type="submit" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          Submit
        </Button>
      </form>
      {/* Success alert */}
      {showSuccessAlert && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => setShowSuccessAlert(false)} // Close alert on close button click
          sx={{ width: '100%', marginTop: 2 }}
        >
          Your form has been submitted successfully.
        </Alert>
      )}
    </Box>
  );
}
