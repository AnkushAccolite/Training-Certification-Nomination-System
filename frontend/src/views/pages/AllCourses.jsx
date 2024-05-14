import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
import AddCourse from './AddCourse';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';

const AllCourses = () => {
  // Dummy data for courses (replace with actual data)
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  const [courses, setCourses] = useState([]);


  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === "ADMIN")) navigate("/login");

    const getCourses=async()=>{
      try {
        const {data}=await axios.get("/course");
        // console.log("courses -> ",data)
        setCourses(data);
        
      } catch (error) {
        console.log(error?.message);
      }
    }
    getCourses();
  }, []);
  const handleClick = () => {
    navigate("/AllCourses/add-course")
  };

  // Create a new Date object
const currentDate = new Date();

// Get the current month name
const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });

// Convert the month name to uppercase
const currentMonthUppercase = currentMonthName.toUpperCase();

  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); // State for selected status filter
  const [selectedMonth, setSelectedMonth] = useState(currentMonthUppercase);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isActivateButtonEnabled, setIsActivateButtonEnabled] = useState(false);
  const [sortingOrder, setSortingOrder] = useState('ascending');

  const handleDomainFilterChange = (event) => {
    const { value } = event.target;
    setSelectedDomain(value === "All" ? "All" : value);
  };

  const handleStatusFilterChange = (event) => {
    const { value } = event.target;
    setSelectedStatus(value === "All" ? "All" : value);
  };

  const handleMonthFilterChange = (event) => {
    const { value } = event.target;
    setSelectedMonth(value === "All" ? "All" : value);
  };

  const deleteCourse = async(id) => {
    try {
      const res = await axios.put(`/course/delete/${id}`);
      navigate(0);
    } catch (error) {
      console.log(error)
    }
  };

  const handleEditCourse = (id) => {
    setEditingCourseId(id);
    const courseToEdit = courses.find(course => course?.courseId === id);
    setEditFields(courseToEdit);
  };

  const handleEditFieldChange = (event, fieldName) => {
    const { value } = event.target;
    setEditFields(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  };

  // const [updatedCourse,setUpdatedCourse] = useState({});
  const saveEditedCourse = async() => {
    try {
      const temp = courses.find(course=>course?.courseId===editingCourseId);
      const updatedCourse={...temp,...editFields};
      console.log(updatedCourse)
      const res = await axios.put(`/course/${editingCourseId}`,updatedCourse);
      navigate(0);
    } catch (error) {
      console.log(error)
    }
  };

  const cancelEditing = () => {
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

  const handleRowCheckboxChange = (event, courseId) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, courseId]);
    } else {
      setSelectedRows(selectedRows.filter(id => id !== courseId));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedRows = filteredCourses.map(course => course?.courseId);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };

  const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;

  const handleActivateButtonClick = async() => {
    try {
      const res = await axios.post(`/course/change-status?month=${selectedMonth}`,selectedRows)
      navigate(0);      

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    setIsActivateButtonEnabled(selectedRows.length > 0);
  }, [selectedRows]);

  const filteredCourses = courses.filter(course => {
    if (selectedDomain === "All" && selectedStatus === "All") {
      return true;
    } else if (selectedDomain === "All" && selectedStatus === "All") {
      return true;
    } else if (selectedDomain === "All") {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus === selectedStatus;
    } else if (selectedStatus === "All") {
      return course?.domain === selectedDomain;
    } else if (selectedDomain === "All") {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus === selectedStatus;
    } else if (selectedStatus === "All") {
      return course?.domain === selectedDomain;
    }else {
      return course?.domain === selectedDomain && course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus === selectedStatus;
    }
  });

  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortingOrder === 'ascending') {
      return a?.courseName.localeCompare(b?.courseName);
    } else {
      return b?.courseName.localeCompare(a?.courseName);
    }
  });

  return (
    <div>
      <h2>All Courses</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Domain filter */}
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label htmlFor="domainFilter">Filter by Domain:</label>
          <Select
            id="domainFilter"
            value={selectedDomain}
            onChange={handleDomainFilterChange}
            style={{ width: '150px' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Non-Technical">Non-Technical</MenuItem>
            <MenuItem value="Power">Power</MenuItem>
            <MenuItem value="Process">Process</MenuItem>
          </Select>
        </div>

        {/* Status filter */}
        <div style={{ flex: '1', marginRight: '10px',marginLeft:"-5px" }}>
          <label htmlFor="statusFilter">Filter by Status:</label>
          <Select
            id="statusFilter"
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            style={{ width: '150px' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value={true}>Active</MenuItem>
            <MenuItem value={false}>Inactive</MenuItem>
          </Select>
        </div>

        {/* Month filter */}
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label htmlFor="monthFilter">Select Month:</label>
          <Select
            id="monthFilter"
            value={selectedMonth}
            onChange={handleMonthFilterChange}
            style={{ width: '150px' }}
          >
            <MenuItem value="JANUARY">January</MenuItem>
            <MenuItem value="FEBRUARY">February</MenuItem>
            <MenuItem value="MARCH">March</MenuItem>
            <MenuItem value="APRIL">April</MenuItem>
            <MenuItem value="MAY">May</MenuItem>
            <MenuItem value="JUNE">June</MenuItem>
            <MenuItem value="JULY">July</MenuItem>
            <MenuItem value="AUGUST">August</MenuItem>
            <MenuItem value="SEPTEMBER">September</MenuItem>
            <MenuItem value="OCTOBER">October</MenuItem>
            <MenuItem value="NOVEMBER">November</MenuItem>
            <MenuItem value="DECEMBER">December</MenuItem>
          </Select>
        </div>

        {/* Add Course Button */}
        <Button variant="contained" onClick={handleClick} style={{ marginRight: '10px' }}>
          Add Course
        </Button>

        {/* Activate Button */}
        <Button
          variant="contained"
          disabled={!isActivateButtonEnabled}
          onClick={handleActivateButtonClick}
        >
          Change Status
        </Button>
      </div>
      
      {/* Table */}
      <Table style={{ backgroundColor: 'white' }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedRows.length > 0 && selectedRows.length < filteredCourses.length}
                checked={selectedRows.length === filteredCourses.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all courses' }}
              />
            </TableCell>
            <TableCell align="center">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                Course Name
                <Button variant="text" onClick={handleSortingOrderChange}>
                  {sortingOrder === 'ascending' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </Button>
              </div>
            </TableCell>
            <TableCell align="center">Duration</TableCell>
            <TableCell align="center">Domain</TableCell>
            <TableCell align="center">Status</TableCell>
            {/* <TableCell align="center">Month</TableCell> */}
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCourses.map(course => (
            <TableRow key={course?.courseId} hover role="checkbox" tabIndex={-1} selected={isSelected(course?.courseId)}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(course?.courseId)}
                  onChange={(event) => handleRowCheckboxChange(event, course?.courseId)}
                  inputProps={{ 'aria-labelledby': `checkbox-${course?.courseId}` }}
                />
              </TableCell>
              <TableCell>
                {editingCourseId === course?.courseId ? (
                  <TextField
                    value={editFields?.courseName || course?.courseName}
                    onChange={(event) => handleEditFieldChange(event, 'courseName')}
                  />
                ) : (
                  <div>
                    {course?.courseName}
                    <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
                  </div>
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course?.courseId ? (
                  <TextField
                    value={editFields?.duration || course?.duration}
                    type='number'
                    onChange={(event) => handleEditFieldChange(event, 'duration')}
                  />
                ) : (
                  course?.duration
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course?.courseId ? (
                  <TextField
                    value={editFields?.domain || course?.domain}
                    onChange={(event) => handleEditFieldChange(event, 'domain')}
                  />
                ) : (
                  course?.domain
                )}
              </TableCell>
              <TableCell align="center">
                <span style={{ color: course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus === false ? 'red' : 'green' }}>
                  {course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus ? "Active":"Inactive"}
                </span>
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course?.courseId ? (
                  <>
                    <Button variant="contained" onClick={saveEditedCourse}>Save</Button>
                    <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '10px' }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => handleEditCourse(course?.courseId)}>Edit</Button>
                    <Button variant="contained" onClick={() => deleteCourse(course?.courseId)} style={{ marginLeft: '10px' }}>Delete</Button>
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

export default AllCourses;
