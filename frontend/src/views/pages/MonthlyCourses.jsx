import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MonthlyCourses = () => {

  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === "ADMIN")) navigate("/login");
  }, []);

  const [courses, setCourses] = useState([
    { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', month: 'January', description: 'Course 1 description' },
    { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', month: 'February', description: 'Course 2 description' },
    { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', month: 'March', description: 'Course 3 description' },
    { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', month: 'April', description: 'Course 4 description' },
    { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', month: 'May', description: 'Course 5 description' },
    { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', month: 'June', description: 'Course 6 description' },
    { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', month: 'July', description: 'Course 7 description' },
    { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', month: 'August', description: 'Course 8 description' },
    { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', month: 'September', description: 'Course 9 description' },
    { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', month: 'October', description: 'Course 10 description' },
    { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', month: 'November', description: 'Course 11 description' },
    // Add more courses here as needed
  ]);

  const [sortingOrder, setSortingOrder] = useState('ascending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');

  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const deleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleDomainFilterChange = (event) => {
    setDomainFilter(event.target.value);
  };

  const handleMonthFilterChange = (event) => {
    setMonthFilter(event.target.value);
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortingOrder === 'ascending') {
      return a.coursename.localeCompare(b.coursename);
    } else {
      return b.coursename.localeCompare(a.coursename);
    }
  });

  const filteredCourses = sortedCourses.filter(course => {
    if (domainFilter === 'All' && monthFilter === 'All') {
      return true;
    } else if (domainFilter === 'All') {
      return course.month === monthFilter;
    } else if (monthFilter === 'All') {
      return course.domain === domainFilter;
    } else {
      return course.domain === domainFilter && course.month === monthFilter;
    }
  });

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>Filter by Domain:</label>
        <Select value={domainFilter} onChange={handleDomainFilterChange} style={{ marginLeft: '10px' }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Technical">Technical</MenuItem>
          <MenuItem value="Non-Technical">Non-Technical</MenuItem>
        </Select>

        <label style={{ marginLeft: '20px' }}>Filter by Month:</label>
        <Select value={monthFilter} onChange={handleMonthFilterChange} style={{ marginLeft: '10px' }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="January">January</MenuItem>
          <MenuItem value="February">February</MenuItem>
          <MenuItem value="March">March</MenuItem>
          <MenuItem value="April">April</MenuItem>
          <MenuItem value="May">May</MenuItem>
          <MenuItem value="June">June</MenuItem>
          <MenuItem value="July">July</MenuItem>
          <MenuItem value="August">August</MenuItem>
          <MenuItem value="September">September</MenuItem>
          <MenuItem value="October">October</MenuItem>
          <MenuItem value="November">November</MenuItem>
          <MenuItem value="December">December</MenuItem>
        </Select>
      </div>

      <h2>Monthly Courses</h2>
      <Table sx={{ backgroundColor: 'white' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              Course Name
              <Button variant="text" onClick={handleSortingOrderChange}>
                {sortingOrder === 'ascending' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </Button>
            </TableCell>
            <TableCell align="center">Duration</TableCell>
            <TableCell align="center">Domain</TableCell>
            <TableCell align="center">Month</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map(course => (
            <TableRow key={course.id}>
              <TableCell>{course.coursename}</TableCell>
              <TableCell align="center">{course.duration}</TableCell>
              <TableCell align="center">{course.domain}</TableCell>
              <TableCell align="center">{course.month}</TableCell>
              <TableCell align="center">
                <Button variant="contained" onClick={() => deleteCourse(course.id)}>Delete</Button>
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
