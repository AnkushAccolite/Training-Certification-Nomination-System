import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 

const CourseReport = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([
    { courseId: 'C001', name: 'Course 1', domain: 'Web Development', employeesEnrolled: 10, completionDate: '2024-04-15', employeesCompleted: 6 },
    { courseId: 'C002', name: 'Course 2', domain: 'Data Science', employeesEnrolled: 15, completionDate: '2024-05-01', employeesCompleted: 12 },
  ]);

  const calculateAttendance = (completed, enrolled) => {
    return Math.round((completed / enrolled) * 100);
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Course Report', 10, 10);
    doc.autoTable({
      head: [['Course ID', 'Name', 'Domain', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Date']],
      body: courses.map(course => [course.courseId, course.name, course.domain, course.employeesEnrolled, course.employeesCompleted, `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`, course.completionDate]),
      startY: 20 
    });
    doc.save('course_report.pdf');
  };

  const handleSearch = () => {
    const filteredCourses = courses.filter(course => {
      const completionDateMonth = new Date(course.completionDate);
      return (!selectedMonth || completionDateMonth === selectedMonthIndex) &&
        (!selectedDomain || course.domain.toLowerCase().includes(selectedDomain.toLowerCase())) &&
        (!searchQuery || course.courseId.toLowerCase().includes(searchQuery.toLowerCase()));
    });
    setCourses(filteredCourses);
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
          <DatePicker
            label="Month"
            value={selectedMonth}
            onChange={(date) => setSelectedMonth(date)}
            views={['year', 'month']}
            style={{ marginRight: '10px' }}
          />
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
                <TableCell>Date</TableCell>
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
                  <TableCell>{course.completionDate}</TableCell>
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
