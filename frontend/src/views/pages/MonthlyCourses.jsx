import React, { useState, useEffect } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import useCourses from 'hooks/useCourses';
import currentMonth from 'utils/currentMonth';
import './MonthlyCourses.css';
import Tooltip from '@mui/material/Tooltip';

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

  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const removeCourse = async (id) => {
    try {
      const res = await axios.post(`/course/change-status?month=${monthFilter}`, [id])
      navigate(0);
    } catch (error) {
      console.log(error)
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
    return true;
  });

  const filteredCourses = sortedCourses.filter(course => {
    if (domainFilter === 'All') {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === monthFilter)?.activationStatus
    } else {
      return course?.domain === domainFilter && course?.monthlyStatus?.find(monthStatus => monthStatus?.month === monthFilter)?.activationStatus
    }
  });

  return (
    <div>
      <h2>Monthly Courses</h2>

      <div className="filter-container">
        <div className="custom-select">
          <Tooltip title="Domain">
            <select value={domainFilter} onChange={handleDomainFilterChange} className="filter-input">
              <option className="menu-item" value="All">All</option>
              <option className="menu-item" value="Technical">Technical</option>
              <option className="menu-item" value="Non-Technical">Non-Technical</option>
              <option className="menu-item" value="Power">Power</option>
              <option className="menu-item" value="Process">Process</option>
            </select>
          </Tooltip>
        </div>
        <div className="custom-select">
          <Tooltip title="Month">
            <select value={monthFilter} onChange={handleMonthFilterChange} className="filter-input">
              <option className="menu-item" value="JANUARY">January</option>
              <option className="menu-item" value="FEBRUARY">February</option>
              <option className="menu-item" value="MARCH">March</option>
              <option className="menu-item" value="APRIL">April</option>
              <option className="menu-item" value="MAY">May</option>
              <option className="menu-item" value="JUNE">June</option>
              <option className="menu-item" value="JULY">July</option>
              <option className="menu-item" value="AUGUST">August</option>
              <option className="menu-item" value="SEPTEMBER">September</option>
              <option className="menu-item" value="OCTOBER">October</option>
              <option className="menu-item" value="NOVEMBER">November</option>
              <option className="menu-item" value="DECEMBER">December</option>
            </select>
          </Tooltip>
        </div>
      </div>

      <Table sx={{ backgroundColor: 'white', borderRadius: '20px', marginTop: '15px' }}>
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
