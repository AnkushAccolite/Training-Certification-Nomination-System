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

function Certifications() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Dummy data for testing purposes
    const dummyCourses = [
      {
        courseId: 1,
        courseName: 'React Fundamentals',
        domain: 'Technical',
        duration: '4 weeks',
        description: 'A beginner-friendly course on React fundamentals.',
        status: 'Not Opted'
      },
      {
        courseId: 2,
        courseName: 'Data Science Essentials',
        domain: 'Technical',
        duration: '6 weeks',
        description: 'Learn the essentials of data science with Python.',
        status: 'Not Opted'
      },
      {
        courseId: 3,
        courseName: 'Digital Marketing Basics',
        domain: 'Domain',
        duration: '3 weeks',
        description: 'Introduction to digital marketing strategies and techniques.',
        status: 'Not Opted'
      },
      // Add more dummy courses as needed
    ];

    setCourses(dummyCourses);
  }, []);

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

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filterCourses = (course) => {
    if (selectedDomain === 'All' && selectedStatus === 'All') {
      return true;
    } else if (selectedDomain === 'All') {
      return course.status === selectedStatus;
    } else if (selectedStatus === 'All') {
      return course.domain === selectedDomain;
    } else {
      return course.domain === selectedDomain && course.status === selectedStatus;
    }
  };

  const nominateCourses = () => {
    const updatedCourses = courses.map(course => {
      if (selectedCourseIds.includes(course.courseId)) {
        return { ...course, status: 'Pending for Approval' };
      }
      return course;
    });
    setCourses(updatedCourses);
    setSelectedCourseIds([]);
  };

  const cancelNomination = () => {
    const updatedCourses = courses.map(course => {
      if (course.status === 'Pending for Approval') {
        return { ...course, status: 'Not Opted' };
      }
      return course;
    });
    setCourses(updatedCourses);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Available Certifications</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
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
                <TableCell>Certification Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.filter(filterCourses).map((row) => (
                <TableRow key={row.courseId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCourseIds.includes(row.courseId)}
                      onChange={(e) => handleCheckboxChange(e, row.courseId)}
                    />
                  </TableCell>
                  <TableCell>{row.courseName}</TableCell>
                  <TableCell>{row.domain}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell style={{ color: row.status === 'Pending for Approval' ? 'red' : 'inherit' }}>{row.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewDetails(row)}>
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={cancelNomination}
                      disabled={row.status !== 'Pending for Approval'}
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
                <h3>{selectedCourse.courseName}</h3>
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

export default Certifications;
