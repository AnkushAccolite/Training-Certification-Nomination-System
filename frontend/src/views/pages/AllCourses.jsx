import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
import AddCourse from './AddCourse';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const AllCourses = () => {
  // Dummy data for courses (replace with actual data)
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === "ADMIN")) navigate("/login");
  }, []);
  const handleClick = () => {
    navigate("/AllCourses/add-course")
  };
  const [courses, setCourses] = useState([
    { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', status: 'inactive', month: 'January', description: 'Course 1 description' },
    { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', status: 'inactive', month: 'February', description: 'Course 2 description' },
    { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'March', description: 'Course 3 description' },
    { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', status: 'inactive', month: 'April', description: 'Course 4 description' },
    { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', status: 'inactive', month: 'May', description: 'Course 5 description' },
    { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'January', description: 'Course 6 description' },
    { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', status: 'inactive', month: 'July', description: 'Course 7 description' },
    { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'August', description: 'Course 8 description' },
    { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'September', description: 'Course 9 description' },
    { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'October', description: 'Course 10 description' },
    { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', status: 'inactive', month: 'November', description: 'Course 11 description' },
    // Add more courses here
  ]);

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All"); // State for selected status filter
  const [selectedMonth, setSelectedMonth] = useState("All");
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

  const deleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleEditCourse = (id) => {
    setEditingCourseId(id);
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
    const updatedCourses = courses.map(course => {
      if (course.id === editingCourseId) {
        return { ...course, ...editFields };
      }
      return course;
    });
    setCourses(updatedCourses);
    setEditingCourseId(null);
    setEditFields({});
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
      const newSelectedRows = filteredCourses.map(course => course.id);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };

  const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;

  const handleActivateButtonClick = () => {
    const updatedCourses = courses.map(course => {
      if (selectedRows.includes(course.id)) {
        return { ...course, status: course.status === 'active' ? 'inactive' : 'active' };
      }
      return course;
    });
    setCourses(updatedCourses);
    setSelectedRows([]);
    setIsActivateButtonEnabled(false);
  };

  useEffect(() => {
    setIsActivateButtonEnabled(selectedRows.length > 0);
  }, [selectedRows]);

  const filteredCourses = courses.filter(course => {
    if (selectedDomain === "All" && selectedStatus === "All" && selectedMonth === "All") {
      return true;
    } else if (selectedDomain === "All" && selectedStatus === "All") {
      return course.month === selectedMonth;
    } else if (selectedDomain === "All" && selectedMonth === "All") {
      return course.status === selectedStatus;
    } else if (selectedStatus === "All" && selectedMonth === "All") {
      return course.domain === selectedDomain;
    } else if (selectedDomain === "All") {
      return course.status === selectedStatus && course.month === selectedMonth;
    } else if (selectedStatus === "All") {
      return course.domain === selectedDomain && course.month === selectedMonth;
    } else if (selectedMonth === "All") {
      return course.domain === selectedDomain && course.status === selectedStatus;
    } else {
      return course.domain === selectedDomain && course.status === selectedStatus && course.month === selectedMonth;
    }
  });

  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortingOrder === 'ascending') {
      return a.coursename.localeCompare(b.coursename);
    } else {
      return b.coursename.localeCompare(a.coursename);
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
          </Select>
        </div>

        {/* Status filter */}
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label htmlFor="statusFilter">Filter by Status:</label>
          <Select
            id="statusFilter"
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            style={{ width: '150px' }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </div>

        {/* Month filter */}
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label htmlFor="monthFilter">Filter by Month:</label>
          <Select
            id="monthFilter"
            value={selectedMonth}
            onChange={handleMonthFilterChange}
            style={{ width: '150px' }}
          >
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
            <TableCell align="center">Month</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCourses.map(course => (
            <TableRow key={course.id} hover role="checkbox" tabIndex={-1} selected={isSelected(course.id)}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(course.id)}
                  onChange={(event) => handleRowCheckboxChange(event, course.id)}
                  inputProps={{ 'aria-labelledby': `checkbox-${course.id}` }}
                />
              </TableCell>
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
                <span style={{ color: course.status === 'inactive' ? 'red' : 'green' }}>
                  {course.status}
                </span>
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.month || course.month}
                    onChange={(event) => handleEditFieldChange(event, 'month')}
                  />
                ) : (
                  course.month
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

export default AllCourses;
