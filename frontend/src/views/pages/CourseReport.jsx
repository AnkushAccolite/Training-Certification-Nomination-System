import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 

const CourseReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([
    { courseId: 'C001', name: 'Course 1', domain: 'Web Development', employeesEnrolled: 10, completionMonth: 4, employeesCompleted: 6 },
    { courseId: 'C002', name: 'Course 2', domain: 'Data Science', employeesEnrolled: 15, completionMonth: 5, employeesCompleted: 12 },
  ]);

  const calculateAttendance = (completed, enrolled) => {
    return Math.round((completed / enrolled) * 100);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Course Report', 10, 10);
  
    const tableData = courses.map(course => [
      course.courseId,
      course.name,
      course.domain,
      course.employeesEnrolled,
      course.employeesCompleted,
      `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`,
      new Date(0, course.completionMonth - 1).toLocaleString('default', { month: 'long' })
    ]);
  
    doc.autoTable({
      head: [['Course ID', 'Name', 'Domain', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Month']],
      body: tableData,
      startY: 20 
    });
    doc.save('course_report.pdf');
  };
  

  const handleSearch = () => {
    const filteredCourses = courses.filter(course => {
      return (!selectedMonth || course.completionMonth === parseInt(selectedMonth)) &&
        (!selectedDomain || course.domain.toLowerCase().includes(selectedDomain.toLowerCase())) &&
        (!searchQuery || course.courseId.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedQuarter === '' || (selectedQuarter === 'Q1' && course.completionMonth >= 1 && course.completionMonth <= 3) ||
        (selectedQuarter === 'Q2' && course.completionMonth >= 4 && course.completionMonth <= 6) ||
        (selectedQuarter === 'Q3' && course.completionMonth >= 7 && course.completionMonth <= 9) ||
        (selectedQuarter === 'Q4' && course.completionMonth >= 10 && course.completionMonth <= 12) ||
        (selectedQuarter === 'H1' && course.completionMonth >= 1 && course.completionMonth <= 6) ||
        (selectedQuarter === 'H2' && course.completionMonth >= 7 && course.completionMonth <= 12));
    });
    setCourses(filteredCourses);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h2" gutterBottom style={{ display: 'flex', marginBottom: '30px' }}>
          Course Report
        </Typography>
        <Typography variant="h3" gutterBottom>
          Filter by:
        </Typography>
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <TextField
            select
            label="Filter"
            value={selectedFilter}
            onChange={handleFilterChange}
            style={{ width: '200px', marginRight: '10px' }}
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quarterly">Quarterly</MenuItem>
            <MenuItem value="HalfYearly">Half Yearly</MenuItem>
            <MenuItem value="Yearly">Yearly</MenuItem>
          </TextField>
          {selectedFilter === 'Monthly' && (
            <TextField
              select
              label="Month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              style={{ width: '200px', marginRight: '10px' }}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={(index + 1).toString()}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
          )}
          {selectedFilter === 'Quarterly' && (
            <TextField
              select
              label="Quarter"
              value={selectedQuarter}
              onChange={(event) => setSelectedQuarter(event.target.value)}
              style={{ width: '200px', marginRight: '10px' }}
            >
              <MenuItem value="Q1">Quarter 1 (Jan - Mar)</MenuItem>
              <MenuItem value="Q2">Quarter 2 (Apr - Jun)</MenuItem>
              <MenuItem value="Q3">Quarter 3 (Jul - Sep)</MenuItem>
              <MenuItem value="Q4">Quarter 4 (Oct - Dec)</MenuItem>
            </TextField>
          )}
          {selectedFilter === 'HalfYearly' && (
            <TextField
              select
              label="Half Year"
              value={selectedQuarter}
              onChange={(event) => setSelectedQuarter(event.target.value)}
              style={{ width: '200px', marginRight: '10px' }}
            >
              <MenuItem value="H1">First Half (Jan - Jun)</MenuItem>
              <MenuItem value="H2">Second Half (Jul - Dec)</MenuItem>
            </TextField>
          )}
          <Autocomplete
            options={['Web Development', 'Data Science', 'Machine Learning', 'UI/UX Design']}
            value={selectedDomain}
            onChange={(event, newValue) => setSelectedDomain(newValue)}
            renderInput={(params) => <TextField {...params} label="Domain" style={{ width: '200px', marginRight: '10px' }} />}
          />
          <TextField
            label="Search by Course ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="course report table">
            <TableHead>
              <TableRow>
                <TableCell>Course ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Employees Enrolled</TableCell>
                <TableCell>Employees Completed</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.domain}</TableCell>
                  <TableCell>{course.employeesEnrolled}</TableCell>
                  <TableCell>{course.employeesCompleted}</TableCell>
                  <TableCell>{`${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`}</TableCell>
                  <TableCell>{new Date(0, course.completionMonth - 1).toLocaleString('default', { month: 'long' })}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          endIcon={<PictureAsPdfIcon />}
          onClick={handleGenerateReport}
          style={{ float: 'right', marginTop: '20px' }}
        >
          Generate report
        </Button>
      </div>
    </LocalizationProvider>
  );
};

export default CourseReport;
