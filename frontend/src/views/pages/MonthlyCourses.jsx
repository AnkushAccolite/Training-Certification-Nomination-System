import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Tooltip
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import useCourses from 'hooks/useCourses';
import currentMonth from 'utils/currentMonth';
import './MonthlyCourses.css';

const MonthlyCourses = () => {

  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === "ADMIN")) navigate("/login");
  }, []);

  const currentMonthUppercase = currentMonth();

  const [sortingOrder, setSortingOrder] = useState('ascending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState(currentMonthUppercase);
  const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];

  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const removeCourse = async (id) => {
    try {
      const res = await axios.post(`/course/change-status?month=${monthFilter}`, [id]);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
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
      return a?.courseName.localeCompare(b?.courseName);
    } else {
      return b?.courseName.localeCompare(a?.courseName);
    }
  });

  const filteredCourses = sortedCourses.filter(course => {
    if (domainFilter === 'All') {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === monthFilter)?.activationStatus;
    } else {
      return course?.domain === domainFilter && course?.monthlyStatus?.find(monthStatus => monthStatus?.month === monthFilter)?.activationStatus;
    }
  });

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Monthly Courses</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
          <Select
            value={monthFilter}
            onChange={handleMonthFilterChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {[
              'January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December',
            ].map((month) => (
              <MenuItem key={month} value={month.toUpperCase()}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="separator"></div>
        <FormControl style={{ marginRight: '10px', marginTop: '10px' }}>
          <Select
            displayEmpty
            value={domainFilter}
            onChange={handleDomainFilterChange}
            renderValue={(selected) => 'Category'}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map(course => (
              <TableRow key={course?.courseId}>
                <TableCell align="center">{course?.courseName}</TableCell>
                <TableCell align="center">{course?.duration}</TableCell>
                <TableCell align="center">{course?.domain}</TableCell>
                <TableCell align="center">
                  <Button variant="contained" onClick={() => removeCourse(course?.courseId)}>Remove</Button>
                  <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showDetails} onClose={handleCloseDetails}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <div>
              <h3>{selectedCourse?.courseName}</h3>
              <p>{selectedCourse?.description}</p>
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
