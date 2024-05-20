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
import useCourses from 'hooks/useCourses';
import currentMonth from 'utils/currentMonth';
import getNominationCourses from 'utils/getNominationCourses';
import axios from '../../api/axios';
import './Courses.css';

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
const statuses = ['All', 'Not Opted', 'Pending for Approval', 'Assigned', 'Completed'];

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

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  const { courses, loading, error } = useCourses();

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');
    if (!localStorage.getItem('refresh')) {
      localStorage.setItem('refresh', true);
      navigate(0);
    }
    const getNominations = async () => {
      const nominationCourses = await getNominationCourses(auth?.user?.empId);

      // console.log('nominationCourses->', nominationCourses?.pendingCourses);

      const pendingCourseIds = nominationCourses?.pendingCourses?.map((course) => course.courseId);
      const approvedCourseIds = nominationCourses?.approvedCourses?.map((course) => course.courseId);

      setPendingCourses(pendingCourseIds);
      setApprovedCourses(approvedCourseIds);
    };
    getNominations();
  }, [auth, navigate]);

  const getStatus = (id) => {
    if (approvedCourses?.includes(id)) return 'Assigned';
    else if (pendingCourses?.includes(id)) return 'Pending for Approval';
    else return 'Not Opted';
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

  const nominateCourses = async () => {
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
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelNomination = async (courseId) => {
    try {
      const res = await axios.get(`/nomination/cancel?empId=${auth?.user?.empId}&courseId=${courseId}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

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
      case 'Assigned':
        return 'green';
      case 'Completed':
        return 'blue';
      default:
        return 'black';
    }
  };

  const filteredRows = courses.filter((course) => {
    if (selectedDomain === 'All' && selectedStatus === 'All') {
      return course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.activationStatus;
    } else if (selectedDomain === 'All') {
      return (
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.activationStatus &&
        getStatus(course?.courseId) === selectedStatus
      );
    } else if (selectedStatus === 'All') {
      return (
        course?.domain === selectedDomain &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.activationStatus
      );
    } else {
      return (
        course?.domain === selectedDomain &&
        course?.monthlyStatus?.find((monthStatus) => monthStatus?.month === selectedMonth)?.activationStatus &&
        getStatus(course?.courseId) === selectedStatus
      );
    }
  });

  return (
    <div>
      <h2 style={{textAlign:'center'}}>Available Courses</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
          <Select value={selectedMonth} onChange={handleMonthChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
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
        <Button
          className="nominateBtn"
          variant="outlined"
          startIcon={<LocalLibraryIcon />}
          onClick={nominateCourses}
          style={{ marginLeft: 'auto', marginRight: '10px' }} // This will move the button to the right
        >
          Nominate
        </Button>
      </div>

      <div style={{ paddingTop: '2%', marginTop: '-20px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration(Hours)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row?.courseId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCourseIds.includes(row?.courseId)}
                      onChange={(e) => handleCheckboxChange(e, row?.courseId)}
                    />
                  </TableCell>
                  <TableCell>{row?.courseName}</TableCell>
                  <TableCell>{row?.domain}</TableCell>
                  <TableCell>{row?.duration}</TableCell>
                  <TableCell style={{ color: getStatusColor(getStatus(row?.courseId)) }}>{getStatus(row?.courseId)}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewDetails(row)}>
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => cancelNomination(row?.courseId)}
                      disabled={getStatus(row?.courseId) !== 'Pending for Approval'}
                      style={{ marginLeft: '8px' }}
                    >
                      Cancel
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
