import React, { useState } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import AddCourse from './AddCourse';

const MonthlyCourses = () => {
 
  const [courses, setCourses] = useState([
    { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', description: 'Course 1 description' },
    { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', description: 'Course 2 description' },
    { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', description: 'Course 3 description' },
    { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', description: 'Course 4 description' },
    { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', description: 'Course 5 description' },
    { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', description: 'Course 6 description' },
    { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', description: 'Course 7 description' },
    { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', description: 'Course 8 description' },
    { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', description: 'Course 9 description' },
    { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', description: 'Course 10 description' },
    { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', description: 'Course 11 description' },
  ]);
  //const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Function to handle domain filter change
  const handleDomainFilterChange = (event) => {
    const { value } = event.target;
    setSelectedDomain(value === "All" ? "All" : value);
  };

  const deleteCourse = (id) => {
    // Filter out the course with the given id
    const updatedCourses = courses.filter(course => course.id !== id);
    // Update the state with the filtered courses
    setCourses(updatedCourses);
  };

  const handleEditCourse = (id) => {
    setEditingCourseId(id);
    // Set the editing fields based on the course being edited
    const courseToEdit = courses.find(course => course.id === id);
    setEditFields(courseToEdit);
  };

  const handleEditFieldChange = (event, fieldName) => {
    const { value } = event.target;
    setEditFields(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  const saveEditedCourse = () => {
    // Update the course with the edited fields
    const updatedCourses = courses.map(course => {
      if (course.id === editingCourseId) {
        return { ...course, ...editFields };
      }
      return course;
    });
    setCourses(updatedCourses);
    // Reset editing state
    setEditingCourseId(null);
    setEditFields({});
  };

  const cancelEditing = () => {
    // Reset editing state
    setEditingCourseId(null);
    setEditFields({});
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const filteredCourses = courses.filter(course => {
    if (selectedDomain!=="All") {
      return course.domain === selectedDomain;
    } else {
      return true;
    }
  });


  return (
    <div>
      <h2>Monthly Courses</h2>

      {/* Domain filter */}
      <label htmlFor="domainFilter" style={{ fontSize: '1 rem' }}>Filter by Domain:</label>
      <Select
        id="domainFilter"
        value={selectedDomain}
        onChange={handleDomainFilterChange}
        sx={{ width: '150px', fontSize: '15px', marginLeft: '10px', color: 'black'}} 
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Technical">Technical</MenuItem>
        <MenuItem value="Non-Technical">Non-Technical</MenuItem>
      </Select>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Course Name</TableCell>
            <TableCell align="center">Duration</TableCell>
            <TableCell align="center">Domain</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map(course => (
            <TableRow key={course.id}>
              <TableCell>
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.coursename || course.coursename}
                    onChange={(event) => handleEditFieldChange(event, 'coursename')}
                  />
                ) : (
                  <div>
                    {course.coursename}
                    <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
                  </div>
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.duration || course.duration}
                    onChange={(event) => handleEditFieldChange(event, 'duration')}
                  />
                ) : (
                  course.duration
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.domain || course.domain}
                    onChange={(event) => handleEditFieldChange(event, 'domain')}
                  />
                ) : (
                  course.domain
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <>
                    <Button variant="contained" onClick={saveEditedCourse}>Save</Button>
                    <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '10px' }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => handleEditCourse(course.id)}>Edit</Button>
                    <Button variant="contained" onClick={() => deleteCourse(course.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Course Details Dialog */}
      <Dialog open={showDetails} onClose={handleCloseDetails}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <div>
              <h3>{selectedCourse.coursename}</h3>
              <p>{selectedCourse.description}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MonthlyCourses;
