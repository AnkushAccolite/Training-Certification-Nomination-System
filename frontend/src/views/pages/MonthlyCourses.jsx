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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const MonthlyCourses = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'ADMIN')) navigate('/login');
  }, []);

  const currentMonthUppercase = currentMonth();

  const [sortingOrder, setSortingOrder] = useState('ascending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState(currentMonthUppercase);
  const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'courseName' || sortConfig.key === 'domain') {
        return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'duration') {
        return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }
    return 0;
  });

  const filteredCourses = sortedCourses.filter((course) => {
    if (domainFilter === 'All') {
      return course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === monthFilter)?.activationStatus;
    } else {
      return (
        course?.domain === domainFilter &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === monthFilter)?.activationStatus
      );
    }
  });

  return (
    <div>
     <h2 style={{textAlign:'center'}}> Monthly Courses</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
          <Select value={monthFilter} onChange={handleMonthFilterChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
              (month) => (
                <MenuItem key={month} value={month.toUpperCase()}>
                  {month}
                </MenuItem>
              )
            )}
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
              <TableCell onClick={() => handleSort('courseName')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                Course Name
                <ArrowDropDownIcon style={{ fontSize: '130%' }} />
              </TableCell>
              <TableCell onClick={() => handleSort('duration')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                Duration
                <ArrowDropDownIcon style={{ fontSize: '130%' }} />
              </TableCell>
              <TableCell onClick={() => handleSort('domain')} style={{ textAlign: 'center', cursor: 'pointer' }}>
                Domain
                <ArrowDropDownIcon style={{ fontSize: '130%' }} />
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course?.courseId}>
                <TableCell style={{ textAlign: 'center' }}>{course?.courseName}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{course?.duration}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{course?.domain}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Button variant="contained" onClick={() => removeCourse(course?.courseId)}>
                    Remove
                  </Button>
                  <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>
                    View Details
                  </Button>
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
