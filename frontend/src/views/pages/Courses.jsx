
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
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
import useCourseStatus from 'hooks/useCourseStatus';
import getNominationCourses from 'utils/getNominationCourses';
import axios from '../../api/axios';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['All', 'Technical', 'Domain', 'Power','Process'];
const statuses = ['All', 'Not Opted', 'Pending for Approval', 'Assigned'];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

function createData(index, category, duration, description) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = [2022, 2023, 2024, 2025];

  let month, year;
  switch (index % 4) {
    case 0:
      month = 'May';
      year = 2024;
      break;
    case 1:
      month = 'April';
      year = 2024;
      break;
    case 2:
      month = 'January';
      year = 2025;
      break;
    case 3:
      month = 'December';
      year = 2024;
      break;
    default:
      month = 'January';
      year = 2024;
      break;
  }

  return { id: index, name: `Course ${index}`, category, duration, month, year, status: 'Not Opted', statusColor: 'black', description };
}

const initialRows = [
  createData(1, 'Technical', 4),
  createData(2, 'Technical', 8),
  createData(3, 'Domain', 3),
  createData(4, 'Technical', 5),
  createData(5, 'Power', 2),
  createData(6, 'Power', 1.5),
  createData(7, 'Domain', 4),
  createData(8, 'Technical', 2),
  createData(9, 'Domains', 2),
  createData(10, 'Technical', 8),
];

function Courses() {
  const theme = useTheme();



  const currentMonthUppercase = currentMonth();



  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthUppercase);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [approvedCourses,setApprovedCourses] = useState([]);
  const [pendingCourses,setPendingCourses] = useState([]);
  
  
  const navigate = useNavigate();
  const auth = useSelector(state=>state?.auth);

  const { courses, loading, error } = useCourses();
  
  

  useEffect(() => {
    if(!(auth?.isAuthenticated))navigate("/login");
    if(!localStorage.getItem("refresh")){
      localStorage.setItem("refresh",true)
      navigate(0);
    }
    const getNominations=async()=>{
      const nominationCourses = await getNominationCourses(auth?.user?.empId);

      setApprovedCourses(nominationCourses?.approvedCourses)
      setPendingCourses(nominationCourses?.pendingCourses)
    }
    getNominations();


  }, []);

  const getStatus = (id)=>{
    // console.log("pending",pendingCourses);
      if(approvedCourses?.includes(id))return "Assigned"
      else if(pendingCourses?.includes(id))return "Pending for Approval"
      else return "Not Opted"
  }

  // const handleChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setSelectedDomain(value);
  // };

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

  const nominateCourses = async() => {
    try {
      const payload={
      "empName":auth?.user?.empName,
      "empId":auth?.user?.empId,
      "nominatedCourses":selectedCourseIds.map(cid=>{
        return {"courseId":cid}
      })
    }
    console.log("payload",payload)
    const res=await axios.post("/nomination",payload);
    navigate(0);
    } catch (error) {
      console.log(error)
    }
  };

  const cancelNomination = (courseId) => {
    const updatedRows = rows.map((row) => {
      if (row.id === courseId) {
        return { ...row, status: 'Not Opted', statusColor: 'black' };
      }
      return row;
    });
    setRows(updatedRows);
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

  const filteredRows = courses.filter(course => {
    if (selectedDomain === "All" && selectedStatus === "All") {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus
    } else if (selectedDomain === "All") {
      return course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus && getStatus(course?.courseId)===selectedStatus; //&&
    } else if (selectedStatus === "All") {
      return course?.domain === selectedDomain && course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus;
    }else {
      return course?.domain === selectedDomain && course?.monthlyStatus?.find(monthStatus => monthStatus?.month === selectedMonth)?.activationStatus && getStatus(course?.courseId) === selectedStatus;
    }
  });

  // const filteredRows = courses?.filter(row => {
  //   if (selectedMonth !== 'All') {
  //     return row.month === selectedMonth && (personName === 'All' || row.category === personName) && (selectedStatus === 'All' || row.status === selectedStatus);
  //   } else if (selectedYear !== 'All') {
  //     return row.year === parseInt(selectedYear) && (personName === 'All' || row.category === personName) && (selectedStatus === 'All' || row.status === selectedStatus);
  //   } else if (selectedMonth !== 'All') {
  //     return row.month === selectedMonth && (personName === 'All' || row.category === personName) && (selectedStatus === 'All' || row.status === selectedStatus);
  //   } else {
  //     return (personName === 'All' || row.category === personName) && (selectedStatus === 'All' || row.status === selectedStatus);
  //   }
  // });

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Stack direction="row" spacing={5} alignItems="center">
          {/* <Stack direction="column" spacing={1} alignItems="center">
            <label htmlFor="demo-year-select">Filter By Year:</label>
            <FormControl sx={{ width: 100 }}>
              <Select
                labelId="demo-year-label"
                id="demo-year-select"
                value={selectedYear}
                onChange={handleYearChange}
              >
                <MenuItem value="All">All</MenuItem>
                {[2022, 2023, 2024, 2025].map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack> */}
          <Stack direction="column" spacing={1} alignItems="center">
            <label htmlFor="demo-month-select">Filter By Month:</label>
            <FormControl sx={{ width: 100 }}>
              <Select
                labelId="demo-month-label"
                id="demo-month-select"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                <MenuItem value="JANUARY">All</MenuItem>
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <MenuItem key={month} value={month.toUpperCase()}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="column" spacing={1} alignItems="center">
            <label htmlFor="demo-category-select">Filter By Category:</label>
            <FormControl sx={{ width: 100 }}>
              <Select
                labelId="demo-category-label"
                id="demo-category-select"
                value={selectedDomain}
                onChange={handleDomainChange}
                style={{ width: '100px' }}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name} style={getStyles(name, selectedDomain, theme)}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="column" spacing={1} alignItems="center">
            <label htmlFor="demo-status-select">Filter By Status:</label>
            <FormControl sx={{ width: 100 }}>
              <Select
                labelId="demo-status-label"
                id="demo-status-select"
                value={selectedStatus}
                onChange={handleStatusChange}
                style={{ width: '100px' }}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status} style={getStyles(status, selectedStatus, theme)}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Stack>
        <Button className="nominateBtn" variant="outlined" startIcon={<LocalLibraryIcon />} onClick={nominateCourses}>
          Nominate
        </Button>
      </Stack>

      <div style={{ paddingTop: '2%', marginTop: '-20px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration(Hours)</TableCell>
                {/* <TableCell>Month</TableCell> */}
                {/* <TableCell>Year</TableCell> */}
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row?.courseId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedCourseIds.includes(row?.courseId)} onChange={(e) => handleCheckboxChange(e, row?.courseId)} />
                  </TableCell>
                  <TableCell>{row?.courseName}</TableCell>
                  <TableCell>{row?.domain}</TableCell>
                  <TableCell>{row?.duration}</TableCell>
                  {/* <TableCell>{row.month}</TableCell> */}
                  {/* <TableCell>{row.year}</TableCell> */}
                  <TableCell style={{ color: row.statusColor }}>{getStatus(row?.courseId)}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewDetails(row)}>
                      View Details
                    </Button>
                    <Button variant="contained" onClick={() => cancelNomination(row.id)} disabled={row.status !== 'Pending for Approval'} style={{ marginLeft: '8px' }}>
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
