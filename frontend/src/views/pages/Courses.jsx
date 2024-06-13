import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import currentMonth from 'utils/currentMonth';
import getNominationCourses from 'utils/getNominationCourses';
import axios from '../../api/axios';
import './Courses.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];
const statuses = ['All', 'Not Opted', 'Pending for Approval', 'Approved', 'Completed'];

function Courses() {
  const currentMonthUppercase = currentMonth();

  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthUppercase);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [approvedCourses, setApprovedCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [monthFilter, setMonthFilter] = useState(currentMonthUppercase);

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);
  const band = auth?.user?.band;

  // const { courses, loading, error } = useCourses();
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get('/course');
      setCourses(data);
    } catch (error) {
      setError(error.message);
      toast.error('Error fetching data');
    }
  };

  const getNominations = async () => {
    const nominationCourses = await getNominationCourses(auth?.user?.empId);

    // console.log('nominationCourses->', nominationCourses?.pendingCourses);

    const pendingCourseIds = nominationCourses?.pendingCourses?.map((course) => course.courseId);
    const approvedCourseIds = nominationCourses?.approvedCourses?.map((course) => course.courseId);
    const completedCourseIds = nominationCourses?.completedCourses?.map((course) => course.courseId);

    setPendingCourses(pendingCourseIds);
    setApprovedCourses(approvedCourseIds);
    setCompletedCourses(completedCourseIds);
  };

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');
    if (!localStorage.getItem('refresh')) {
      localStorage.setItem('refresh', true);
      navigate(0);
    }
    fetchCourses();
    getNominations();
  }, [auth, navigate]);

  const getStatus = (id) => {
    if (completedCourses?.includes(id)) return 'Completed';
    if (approvedCourses?.includes(id)) return 'Approved';
    if (pendingCourses?.includes(id)) return 'Pending for Approval';
    return 'Not Opted';
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleCheckboxChange = (event, courseId) => {
    const { checked } = event.target;
    setSelectedCourseIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, courseId];
      } else {
        return prevSelected.filter((id) => id !== courseId);
      }
    });
  };
  const handleMonthFilterChange = (event) => {
    setMonthFilter(event.target.value);
    setSelectedMonth(event.target.value);
  };

  const nominateCourses = async () => {
    if (selectedCourseIds.length === 0) {
      toast.error('Please select at least one course to nominate');
      return;
    }
    try {
      const payload = {
        empName: auth?.user?.empName,
        empId: auth?.user?.empId,
        nominatedCourses: selectedCourseIds.map((cid) => {
          return { courseId: cid };
        })
      };
      console.log('payload', payload);
      const res = await axios.post(`/nomination?month=${selectedMonth}`, payload);
      setSelectedCourseIds([]);
      toast.success('Succesfully Nominated');
      getNominations();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const cancelNomination = async (courseId) => {
    try {
      const res = await axios.get(`/nomination/cancel?empId=${auth?.user?.empId}&courseId=${courseId}`);
      toast.success('Nomination cancelled successfully');
      getNominations();
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  // const handleMonthChange = (event) => {
  //   setSelectedMonth(event.target.value);
  // };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending for Approval':
        return 'red';
      case 'Approved':
        return 'green';
      case 'Completed':
        return 'blue';
      default:
        return 'black';
    }
  };

  const filteredRows = courses.filter((course) => {
    if (selectedDomain === 'All' && selectedStatus === 'All') {
      return course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands?.includes(auth?.user?.band);
    } else if (selectedDomain === 'All') {
      return (
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands?.includes(auth?.user?.band) &&
        getStatus(course?.courseId) === selectedStatus
      );
    } else if (selectedStatus === 'All') {
      return (
        course?.domain === selectedDomain &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands?.includes(auth?.user?.band)
      );
    } else {
      return (
        course?.domain === selectedDomain &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.bands?.includes(auth?.user?.band) &&
        getStatus(course?.courseId) === selectedStatus
      );
    }
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...filteredRows].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'courseName' || sortConfig.key === 'domain' || sortConfig.key === 'status') {
        return (aValue?.localeCompare(bValue) || 0) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'duration') {
        return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }
    return 0;
  });

  const isPastMonth = (month) => {
    const currentMonthIndex = new Date().getMonth();
    const monthIndex = new Date(`${month} 1, 2023`).getMonth(); // 2023 is used just as a reference year
    return monthIndex < currentMonthIndex;
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Available Courses</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
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
        <div className="separator"></div>
        <FormControl style={{ marginRight: '10px', marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedDomain}
            onChange={handleDomainChange}
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
        <div className="separator"></div>
        <FormControl style={{ marginRight: '10px', marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedStatus}
            onChange={handleStatusChange}
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
          <Button
            className="nominateBtn"
            variant="outlined"
            startIcon={<LocalLibraryIcon />}
            onClick={nominateCourses}
            style={{ marginLeft: 'auto', marginRight: '10px' }} // This will move the button to the right
          >
            Nominate
          </Button>
        )}
      </div>

      <div style={{ paddingTop: '2%', marginTop: '-20px' }}>
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <div style={{ height: 'calc(100vh - 300px)', overflowY: 'auto' }}>
            {sortedCourses.length !== 0 ? (
              <TableContainer
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  paddingRight: '8px', // Adjust padding to accommodate scrollbar width
                  marginBottom: '-16px' // Compensate for the added
                }}
                component={Paper}
                sx={{
                  maxHeight: '100%',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px', // Reduce width of the scrollbar
                    borderRadius: '3px' // Round scrollbar corners
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#FFFFFF' // Background color of the scrollbar track
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#eee6ff', // Color of the scrollbar thumb (handle)
                    borderRadius: '3px' // Round scrollbar thumb corners
                  }
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {!isPastMonth(monthFilter) && <TableCell></TableCell>}
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedCourses.map((row, index) => (
                      <TableRow
                        key={row?.courseId}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          backgroundColor: index % 2 === 0 ? '#F2F2F2' : 'white'
                        }}
                      >
                        {!isPastMonth(monthFilter) && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedCourseIds.includes(row?.courseId)}
                              onChange={(e) => handleCheckboxChange(e, row?.courseId)}
                              disabled={getStatus(row?.courseId) !== 'Not Opted'}
                            />
                          </TableCell>
                        )}

                        <TableCell style={{ textAlign: 'center', maxWidth: '20em' }}>{row?.courseName}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{row?.domain}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{row?.duration}</TableCell>
                        <TableCell style={{ color: getStatusColor(getStatus(row?.courseId)), textAlign: 'center' }}>
                          {getStatus(row?.courseId)}
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Button variant="contained" onClick={() => handleViewDetails(row)}>
                            View Details
                          </Button>
                          {!isPastMonth(monthFilter) && (
                            <Button
                              variant="outlined"
                              onClick={() => cancelNomination(row?.courseId)}
                              disabled={getStatus(row?.courseId) !== 'Pending for Approval'}
                              style={{ marginLeft: '8px' }}
                            >
                              Cancel
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
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
            )}
          </div>
        </div>
        <Dialog open={showDetails} onClose={handleCloseDetails}>
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <div>
                <h3>{selectedCourse.name}</h3>
                <p>{selectedCourse.description}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Courses;
