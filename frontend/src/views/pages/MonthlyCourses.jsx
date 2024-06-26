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
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import currentMonth from 'utils/currentMonth';
import './MonthlyCourses.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';

const MonthlyCourses = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/course');
      setCourses(data);
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'ADMIN')) navigate('/login');
    fetchCourses();
  }, []);

  const currentMonthUppercase = currentMonth().toUpperCase();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState(currentMonthUppercase);
  const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
        return aValue?.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'duration') {
        return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }
    return 0;
  });

  const filteredCourses = sortedCourses.filter((course) => {
    if (domainFilter === 'All') {
      return course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === monthFilter)?.bands?.length > 0;
    } else {
      return (
        course?.domain === domainFilter &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === monthFilter)?.bands?.length > 0
      );
    }
  });

  // const isPastMonth = (month) => {
  //   const currentMonthIndex = new Date().getMonth();
  //   const monthIndex = new Date(`${month} 1, 2023`).getMonth(); // 2023 is used just as a reference year
  //   return monthIndex < currentMonthIndex;
  // };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}> Monthly Courses</h2>
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

      <div style={{ flex: '1', overflow: 'hidden' }}>
        <div style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          {filteredCourses.length === 0 ? (
            <div
              style={{
                width: '100%',
                height: '70%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              No Courses Available for This month
            </div>
          ) : (
            <TableContainer
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                paddingRight: '8px',
                marginBottom: '-16px'
              }}
              component={Paper}
              sx={{
                maxHeight: '100%',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  borderRadius: '3px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#FFFFFF'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#eee6ff',
                  borderRadius: '3px'
                }
              }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('courseName')}>
                      <div
                        style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Course Name
                        {sortConfig.key === 'courseName' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                          ) : (
                            <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                          )
                        ) : (
                          <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('duration')}>
                      <div
                        style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                      >
                        Duration (hrs)
                        {sortConfig.key === 'duration' ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                          ) : (
                            <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                          )
                        ) : (
                          <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                        )}
                      </div>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Bands</TableCell>
                    <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses.map((course, index) => (
                    <TableRow key={course?.courseId} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                      <TableCell style={{ textAlign: 'center' }}>{course?.courseName}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{course?.duration}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{course?.domain}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === monthFilter)?.bands?.join(', ')}
                      </TableCell>

                      <TableCell style={{ textAlign: 'center' }}>
                        <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>

      <Dialog 
        open={showDetails} 
        onClose={handleCloseDetails} 
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            display: 'flex',
            flexDirection: 'column',
            paddingTop:'0.7%',
            justifyContent: 'space-between', 
          },
        }}
      >
      <DialogTitle variant="h3"style={{ fontSize: '19px', textAlign: 'center',paddingBottom:'0.6% '  }}>Course Details</DialogTitle>
      <DialogContent sx={{ flex: 1, overflowY: 'auto' ,paddingBottom:'0% ' }}>
        {selectedCourse && (
          <div>
            <h3 style={{textAlign:'center',paddingBottom:'0% ' }}>{selectedCourse?.courseName}</h3>
            <p style={{textAlign:'center'}}>{selectedCourse?.description}</p>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} variant='outlined'>Close</Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default MonthlyCourses;
