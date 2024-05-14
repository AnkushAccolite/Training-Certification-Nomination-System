import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, Popover, List, ListItem, ListItemText } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const CourseReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null); // State for anchor element of popover
  const [courses, setCourses] = useState([
    { courseId: 'C001', name: 'Course 1', category: 'Power', employeesEnrolled: 10, completionMonth: 4, employeesCompleted: 6 },
    { courseId: 'C002', name: 'Course 2', category: 'Process', employeesEnrolled: 15, completionMonth: 5, employeesCompleted: 12 },
  ]);

  const calculateAttendance = (completed, enrolled) => {
    return Math.round((completed / enrolled) * 100);
  };

  const handleGenerateReport = (format) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Course Report', 10, 10);

    const tableData = courses.map(course => [
      course.courseId,
      course.name,
      course.category,
      course.employeesEnrolled,
      course.employeesCompleted,
      `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`,
      getMonthName(course.completionMonth)
    ]);

    const tableData1 = courses.map(course => ({
      'Course ID': course.courseId,
      'Name': course.name,
      'Category': course.category,
      'Employees Enrolled': course.employeesEnrolled,
      'Employees Completed': course.employeesCompleted,
      'Attendance': `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`,
      'Completion Month': getMonthName(course.completionMonth)
    }));

    switch (format) {
      case 'pdf':
        doc.autoTable({
          head: [['Course ID', 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month']],
          body: tableData,
          startY: 20
        });
        doc.save('course_report.pdf');
        break;
      case 'excel':
        const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Course Report');
        XLSX.writeFile(wb, 'course_report.xlsx');
        break;
      case 'csv':
        const csv = Papa.unparse({
          fields: ['Course ID', 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month'],
          data: tableData
        });
        const csvContent = `data:text/csv;charset=utf-8,${csv}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'course_report.csv');
        document.body.appendChild(link);
        link.click();
        break;
    }
  };

  const getMonthName = (month) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month - 1];
  };

  const handleSearch = () => {
    const filteredCourses = courses.filter(course => {
      return ((!selectedMonth || course.completionMonth.toString() === selectedMonth) &&
        (!selectedCategory || course.category.toLowerCase() === selectedCategory.toLowerCase()) &&
        (!searchQueryName || course.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || course.courseId.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        (selectedQuarter === '' || (selectedQuarter === 'Q1' && course.completionMonth >= 1 && course.completionMonth <= 3) ||
          (selectedQuarter === 'Q2' && course.completionMonth >= 4 && course.completionMonth <= 6) ||
          (selectedQuarter === 'Q3' && course.completionMonth >= 7 && course.completionMonth <= 9) ||
          (selectedQuarter === 'Q4' && course.completionMonth >= 10 && course.completionMonth <= 12) ||
          (selectedQuarter === 'H1' && course.completionMonth >= 1 && course.completionMonth <= 6) ||
          (selectedQuarter === 'H2' && course.completionMonth >= 7 && course.completionMonth <= 12)));
    });
    setCourses(filteredCourses);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const handleDownloadClick = (event) => {
    setDownloadAnchorEl(event.currentTarget);
  };

  const handleDownloadClose = () => {
    setDownloadAnchorEl(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h2" gutterBottom style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Course Report
          <Button
            variant="contained"
            endIcon={<GetAppIcon />}
            onClick={handleDownloadClick}
          >
            Download
          </Button>
          <Popover
            open={Boolean(downloadAnchorEl)}
            anchorEl={downloadAnchorEl}
            onClose={handleDownloadClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <List>
              <ListItem button onClick={() => handleGenerateReport('pdf')}>
                <ListItemText primary="Download as PDF" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('excel')}>
                <ListItemText primary="Download as XLSX" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('csv')}>
                <ListItemText primary="Download as CSV" />
              </ListItem>
            </List>
          </Popover>
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
            <MenuItem value="Yearly">Yearly</MenuItem>
          </TextField>
          {selectedFilter === 'Monthly' && (
            <DatePicker
              label="Month"
              value={selectedMonth}
              onChange={(date) => setSelectedMonth(date.getMonth() + 1)}
              views={['month']}
              style={{ marginRight: '10px' }}
            />
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
          <Autocomplete
            options={['Power', 'Process', 'Technical', 'Domain']}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="Category" style={{ width: '200px', marginRight: '10px' }} />}
          />
          <TextField
            label="Search by Course ID"
            value={searchQueryID}
            onChange={(e) => setSearchQueryID(e.target.value)}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <TextField
            label="Search by Course Name"
            value={searchQueryName}
            onChange={(e) => setSearchQueryName(e.target.value)}
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
                <TableCell>Category</TableCell>
                <TableCell>Employees Enrolled</TableCell>
                <TableCell>Employees Completed</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Completion Month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell>{course.courseId}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.employeesEnrolled}</TableCell>
                  <TableCell>{course.employeesCompleted}</TableCell>
                  <TableCell>{`${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`}</TableCell>
                  <TableCell>{getMonthName(course.completionMonth)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </LocalizationProvider>
  );
};

export default CourseReport;
