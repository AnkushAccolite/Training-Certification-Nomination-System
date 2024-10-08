import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableContainer,
  Paper,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';
import currentMonth from 'utils/currentMonth';
import FormControl from '@mui/material/FormControl';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './allcourses.css';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';

const AllCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);
  const currentMonthUppercase = currentMonth();
  const [monthFilter, setMonthFilter] = useState(currentMonthUppercase);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedBand, setSelectedBand] = useState('Band');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthUppercase);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isActivateButtonEnabled, setIsActivateButtonEnabled] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);

  const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];
  const statuses = ['All', 'Active', 'Inactive'];

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/course');
      setCourses(data);
    } catch (error) {
      setError(error.message);
      toast.error('Error fetching data');
    }
  };

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'ADMIN')) navigate('/login');
    fetchCourses();
  }, []);
  const handleClick = () => {
    navigate('/AllCourses/add-course');
  };

  const handleDomainFilterChange = (event) => {
    const { value } = event.target;
    setSelectedDomain(value === 'All' ? 'All' : value);
  };

  const handleStatusFilterChange = (event) => {
    const { value } = event.target;
    setSelectedStatus(value);
  };

  const handleMonthFilterChange = (event) => {
    setMonthFilter(event.target.value);
    const { value } = event.target;
    setSelectedMonth(value === 'All' ? 'All' : value);
  };
  const handleBandFilterChange = (event) => {
    const { value } = event.target;
    setSelectedBand(value);
  };

  const deleteCourse = async (id) => {
    try {
      const res = await axios.put(`/course/delete/${id}`);
      toast.success('Course Deleted Successfully');
      fetchCourses();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handleEditCourse = (id) => {
    setEditingCourseId(id);
    const courseToEdit = courses.find((course) => course?.courseId === id);
    setEditFields(courseToEdit);
  };

  const handleEditFieldChange = (event, fieldName) => {
    const { value } = event.target;
    setEditFields((prevState) => ({
      ...prevState,
      [fieldName]: value
    }));
  };
  const saveEditedCourse = async () => {
    try {
      const temp = courses.find((course) => course?.courseId === editingCourseId);
      const updatedCourse = { ...temp, ...editFields };
      console.log(updatedCourse);
      const res = await axios.put(`/course/${editingCourseId}`, updatedCourse);
      toast.success('Course updated Successfully');
      fetchCourses();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
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
      setSelectedRows(selectedRows.filter((id) => id !== courseId));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedRows = filteredCourses.map((course) => course?.courseId);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };

  const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;
  const handleActivateButtonClick = async () => {
    try {
      if (selectedBand === 'Band') {
        toast.error('Please select a band');
        return;
      }
      const res = await axios.post(`/course/change-status?month=${selectedMonth}&band=${selectedBand}`, selectedRows);
      toast.success('Successfully changed Status');
      fetchCourses();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  useEffect(() => {
    setIsActivateButtonEnabled(selectedRows.length > 0);
  }, [selectedRows]);

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

  const filteredCourses = sortedCourses
    .filter((course) => {
      if (selectedDomain === 'All' && selectedStatus === 'All') {
        return true;
      } else if (selectedDomain === 'All') {
        const bands = course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands;
        if (selectedStatus === 'All') {
          return true;
        } else if (selectedStatus === 'Active') {
          return bands && bands.includes(selectedBand);
        } else {
          return !bands || !bands.includes(selectedBand);
        }
      } else if (selectedStatus === 'All') {
        return course?.domain === selectedDomain;
      } else {
        const bands = course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands;
        if (selectedStatus === 'Active') {
          return course?.domain === selectedDomain && bands && bands.includes(selectedBand);
        } else {
          return course?.domain === selectedDomain && (!bands || !bands.includes(selectedBand));
        }
      }
    })
    .slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const allSelectedActive = selectedRows.every((courseId) =>
    sortedCourses
      .find((course) => course.courseId === courseId)
      ?.monthlyStatus?.find((monthStatus) => monthStatus.month === selectedMonth)
      ?.bands?.includes(selectedBand)
  );

  const allSelectedInactive = selectedRows.every((courseId) => {
    const course = sortedCourses.find((course) => course.courseId === courseId);
    const monthStatus = course.monthlyStatus.find((status) => status.month === selectedMonth);
    return !monthStatus?.bands?.includes(selectedBand);
  });

  let buttonText = 'Change Status';
  let buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    width: '100px'
  };

  if (selectedRows.length === 0) {
    buttonText = 'Activate';
    buttonStyle.backgroundColor = 'lightgrey';
  } else if (allSelectedActive) {
    buttonText = 'Deactivate';
    buttonStyle.backgroundColor = '#eb4034';
  } else if (allSelectedInactive) {
    buttonText = 'Activate';
    buttonStyle.backgroundColor = '#3ea115';
  } else {
    buttonText = 'Invert ';
    buttonStyle.backgroundColor = '#3453cf';
  }

  const isPastMonth = (month) => {
    const currentMonthIndex = new Date().getMonth();
    const monthIndex = new Date(`${month} 1, 2023`).getMonth(); // 2023 is used just as a reference year
    return monthIndex < currentMonthIndex;
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedCourses.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '-5px' }}>All Courses</h2>

      {/* Filters */}
      <div className="filter">
        <FormControl style={{ marginRight: '10px', marginTop: '10px' }}>
          <Select value={selectedBand} onChange={handleBandFilterChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
            {['Band', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'].map((band) => (
              <MenuItem key={band} value={band}>
                {band}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="separators"></div>
        <FormControl style={{ marginTop: '10px' }}>
          <Select value={selectedMonth} onChange={handleMonthFilterChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
              (month) => (
                <MenuItem key={month} value={month.toUpperCase()}>
                  {month}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <div className="separators"></div>
        <FormControl style={{ marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedDomain}
            onChange={handleDomainFilterChange}
            renderValue={(selected) => {
              return 'Category';
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="separators"></div>
        <FormControl style={{ marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            renderValue={(selected) => {
              return 'Status';
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {!isPastMonth(monthFilter) && (
          <Button className="addCourse" variant="outlined" onClick={handleClick}>
            Add Course
          </Button>
        )}
        {!isPastMonth(monthFilter) && (
          <Button
            className="activateButton"
            variant="contained"
            disabled={!isActivateButtonEnabled}
            onClick={handleActivateButtonClick}
            style={buttonStyle}
          >
            {buttonText}
          </Button>
        )}
      </div>

      {/* Table */}
      <div style={{ paddingTop: '2%', marginTop: '-20px' }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <div style={{ height: 'calc(109vh - 347px)', overflowY: 'auto' }}>
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
                No Courses Available
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
                      {!isPastMonth(monthFilter) && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selectedRows.length > 0 && selectedRows.length < filteredCourses.length}
                            checked={selectedRows.length === filteredCourses.length}
                            onChange={handleSelectAllClick}
                            inputProps={{ 'aria-label': 'select all courses' }}
                          />
                        </TableCell>
                      )}
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Details</TableCell>
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
                      {!isPastMonth(monthFilter) && (
                        <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCourses.map((course, index) => (
                      <TableRow
                        key={course?.courseId}
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        selected={isSelected(course?.courseId)}
                        style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}
                      >
                        {!isPastMonth(monthFilter) && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected(course?.courseId)}
                              onChange={(event) => handleRowCheckboxChange(event, course?.courseId)}
                              inputProps={{ 'aria-labelledby': `checkbox-${course?.courseId}` }}
                            />
                          </TableCell>
                        )}
                        <TableCell style={{ textAlign: 'center' }}>
                          {editingCourseId === course?.courseId ? (
                            <TextField
                              value={editFields?.courseName || course?.courseName}
                              onChange={(event) => handleEditFieldChange(event, 'courseName')}
                            />
                          ) : (
                            <div style={{ maxWidth: '15rem' }}>{course?.courseName}</div>
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Button variant="contained" onClick={() => handleViewDetails(course)}>
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {editingCourseId === course?.courseId ? (
                            <TextField
                              value={editFields?.duration || course?.duration}
                              type="number"
                              onChange={(event) => handleEditFieldChange(event, 'duration')}
                            />
                          ) : (
                            course?.duration
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {editingCourseId === course?.courseId ? (
                            <TextField
                              value={editFields?.domain || course?.domain}
                              onChange={(event) => handleEditFieldChange(event, 'domain')}
                            />
                          ) : (
                            course?.domain
                          )}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <span
                            style={{
                              color: course?.monthlyStatus
                                ?.find((monthStatus) => monthStatus?.month === selectedMonth)
                                ?.bands?.includes(selectedBand)
                                ? 'green'
                                : 'red'
                            }}
                          >
                            {course?.monthlyStatus
                              ?.find((monthStatus) => monthStatus?.month === selectedMonth)
                              ?.bands?.includes(selectedBand)
                              ? 'Active'
                              : 'Inactive'}
                          </span>
                        </TableCell>
                        {!isPastMonth(monthFilter) && (
                          <TableCell style={{ textAlign: 'center' }}>
                            {editingCourseId === course?.courseId ? (
                              <>
                                <Button variant="contained" onClick={saveEditedCourse} style={{ marginBottom: '5px' }}>
                                  Save
                                </Button>
                                <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '5px' }}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="contained"
                                  onClick={() => handleEditCourse(course?.courseId)}
                                  style={{ marginBottom: '5px' }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => deleteCourse(course?.courseId)}
                                  style={{ marginLeft: '10px', marginBottom: '5px' }}
                                >
                                  Delete
                                </Button>
                              </>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        </div>
      </div>
      <div>
        <Pagination
          count={Math.ceil(sortedCourses.length / rowsPerPage)}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={(event) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            setRowsPerPage(newRowsPerPage);
            setPage(1);
          }}
        />
      </div>

      {/* Course Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={handleCloseDetails}
        sx={{
          '& .MuiDialog-paper': {
            width: '500px',
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '0.7%',
            justifyContent: 'space-between'
          }
        }}
      >
        <DialogTitle variant="h3" style={{ fontSize: '19px', textAlign: 'center', paddingBottom: '0.6% ' }}>
          Course Details
        </DialogTitle>
        <DialogContent sx={{ flex: 1, overflowY: 'auto', paddingBottom: '0% ' }}>
          {selectedCourse && (
            <div>
              <h3 style={{ textAlign: 'center', paddingBottom: '0% ' }}>{selectedCourse?.courseName}</h3>
              <p style={{ textAlign: 'center' }}>{selectedCourse?.description}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AllCourses;
