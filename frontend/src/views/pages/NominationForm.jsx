

import React, { useState } from 'react';
import { Box, FormControl, InputLabel, OutlinedInput, MenuItem, Select, Chip, Button } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};
const courseOptions = [
  'Course A',
  'Course B',
  'Course C',
  'Course D',
  // Add more courses as needed
];

export default function NominationForm() {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    coursesToEnroll: [],
    suggestions: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (event) => {
    const { value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      coursesToEnroll: value,
    }));
  };

  const handleSuggestionsFocus = () => {
    // Do not reset the coursesToEnroll field when moving to the suggestions field
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, you can send formData to server or perform any other action
    console.log(formData);
    // Reset form data after submission
    setFormData({
      employeeName: '',
      employeeID: '',
      coursesToEnroll: [],
      suggestions: ''
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
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>NOMINATION FORM</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="employee-name">Employee Name</InputLabel>
          <OutlinedInput
            id="employee-name"
            type="text"
            name="employeeName"
            value={formData.employeeName}
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
            name="employeeID"
            value={formData.employeeID}
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
            value={formData.coursesToEnroll}
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
            {courseOptions.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 3 }}>
          <InputLabel htmlFor="suggestions">Suggestions</InputLabel>
          <OutlinedInput
            id="suggestions"
            multiline
            rows={4}
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            onFocus={handleSuggestionsFocus}
            label="Suggestions"
            required
          />
        </FormControl>
        <Button type="submit" variant="contained" sx={{ width: '100%', borderRadius: 5 }}>
          Submit
        </Button>
      </form>
    </Box>
  );
}




