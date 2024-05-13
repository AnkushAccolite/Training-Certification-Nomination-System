import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, Popover, List, ListItem, ListItemText } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import * as XLSX from 'xlsx'; 
import Papa from 'papaparse'; 

const EmployeeReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null); // State for anchor element of popover

  const [employees, setEmployees] = useState([
    { 
      empID: '001', 
      name: 'John', 
      category: ['Domain', 'Power', 'Technical'], 
      coursesEnrolled: ['React', 'Node.js', 'Express'], 
      completionMonth: [4, 5, 7] 
    },
    { 
      empID: '002', 
      name: 'Jane', 
      category: ['Domain', 'Power'], 
      coursesEnrolled: ['Machine Learning', 'Python'], 
      completionMonth: [5, 9] 
    },
    { 
      empID: '003', 
      name: 'Doe', 
      category: ['Power', 'Technical'], 
      coursesEnrolled: ['Sketch', 'Figma'], 
      completionMonth: [6, 6] 
    },
    { 
      empID: '004', 
      name: 'Smith', 
      category: ['Domain', 'Technical'], 
      coursesEnrolled: ['HTML', 'CSS'], 
      completionMonth: [7, 10] 
    },
  ]);

  const handleGenerateReport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Employee Report', 10, 10);

      const tableData = employees.map(employee => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.completionMonth.map(month => new Date(0, month - 1).toLocaleString('default', { month: 'long' })).join(', ')
      ]);

      doc.autoTable({
        head: [['EmpID', 'Name', 'Courses', 'Completion Month']], 
        body: tableData,
        startY: 20
      });
      doc.save('employee_report.pdf');
    } else if (format === 'xlsx') {
      const tableData1 = employees.reduce((acc, employee) => {
        employee.completionMonth.forEach((month, index) => {
          acc.push({
            'EmpID': employee.empID,
            'Name': employee.name,
            'Courses': employee.coursesEnrolled[index],
            'Category': employee.category[index],
            'Month': new Date(0, month - 1).toLocaleString('default', { month: 'long' })
          });
        });
        return acc;
      }, []);

      const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
      XLSX.writeFile(wb, 'employee_report.xlsx');
    } else if (format === 'csv') {
      const tableData = employees.map(employee => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.completionMonth.map(month => new Date(0, month - 1).toLocaleString('default', { month: 'long' })).join(', ')
      ]);

      const csv = Papa.unparse({
        fields: ['EmpID', 'Name', 'Courses', 'Completion Month'], 
        data: tableData
      });
      const csvContent = `data:text/csv;charset=utf-8,${csv}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'employee_report.csv');
      document.body.appendChild(link);
      link.click();
    }
  };

  // const handleSearch = () => {
  //   const filteredEmployees = employees.filter(employee => {
  //     const hasSelectedCategory = employee.category.some(cat => cat === selectedCategory);
  //     return (
  //       (!selectedMonth || employee.completionMonth.includes(parseInt(selectedMonth))) &&
  //       (selectedCategory === '' || hasSelectedCategory) && 
  //       (!searchQueryName || employee.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
  //       (!searchQueryID || employee.empID.toLowerCase().includes(searchQueryID.toLowerCase())) &&
  //       (selectedQuarter === '' || 
  //         (selectedQuarter === 'Q1' && employee.completionMonth.some(month => month >= 1 && month <= 3)) ||
  //         (selectedQuarter === 'Q2' && employee.completionMonth.some(month => month >= 4 && month <= 6)) ||
  //         (selectedQuarter === 'Q3' && employee.completionMonth.some(month => month >= 7 && month <= 9)) ||
  //         (selectedQuarter === 'Q4' && employee.completionMonth.some(month => month >= 10 && month <= 12)) ||
  //         (selectedQuarter === 'H1' && employee.completionMonth.some(month => month >= 1 && month <= 6)) ||
  //         (selectedQuarter === 'H2' && employee.completionMonth.some(month => month >= 7 && month <= 12)))
  //     );
  //   });
  
  //   setEmployees(filteredEmployees);
  // };

  const handleSearch = () => {
    const filteredEmployees = employees.filter(employee => {
      const filteredCourses = employee.coursesEnrolled.filter((course, index) => {
        const hasSelectedCategory = employee.category[index] === selectedCategory;
        return hasSelectedCategory;
      });
  
      return (
        (!selectedMonth || employee.completionMonth.includes(parseInt(selectedMonth))) &&
        (!searchQueryName || employee.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || employee.empID.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        (selectedCategory === '' || filteredCourses.length > 0) && 
        (selectedQuarter === '' || 
          (selectedQuarter === 'Q1' && employee.completionMonth.some(month => month >= 1 && month <= 3)) ||
          (selectedQuarter === 'Q2' && employee.completionMonth.some(month => month >= 4 && month <= 6)) ||
          (selectedQuarter === 'Q3' && employee.completionMonth.some(month => month >= 7 && month <= 9)) ||
          (selectedQuarter === 'Q4' && employee.completionMonth.some(month => month >= 10 && month <= 12)) ||
          (selectedQuarter === 'H1' && employee.completionMonth.some(month => month >= 1 && month <= 6)) ||
          (selectedQuarter === 'H2' && employee.completionMonth.some(month => month >= 7 && month <= 12)))
      );
    });
  
    setEmployees(filteredEmployees);
  };


  
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h2" gutterBottom style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          Employee Report
          <div>
            <Button
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={(event) => setDownloadAnchorEl(event.currentTarget)}
            >
              Download
            </Button>
            <Popover
              open={Boolean(downloadAnchorEl)}
              anchorEl={downloadAnchorEl}
              onClose={() => setDownloadAnchorEl(null)}
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
                <ListItem button onClick={() => handleGenerateReport('xlsx')}>
                  <ListItemText primary="Download as XLSX" />
                </ListItem>
                <ListItem button onClick={() => handleGenerateReport('csv')}>
                  <ListItemText primary="Download as CSV" />
                </ListItem>
              </List>
            </Popover>
          </div>
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
            options={['Domain', 'Power', 'Technical']}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => <TextField {...params} label="Category" style={{ width: '200px', marginRight: '10px' }} />}
          />
          <TextField
            label="Search by Employee ID"
            value={searchQueryID}
            onChange={(e) => setSearchQueryID(e.target.value)}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <TextField
            label="Search by Employee Name"
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
          <Table aria-label="employee report table">
            <TableHead>
              <TableRow>
                <TableCell>EmpID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Courses</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Completion Month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                employee.coursesEnrolled.map((course, index) => (
                  <TableRow key={`${employee.empID}-${course}`}>
                    {index === 0 && (
                      <TableCell rowSpan={employee.coursesEnrolled.length}>{employee.empID}</TableCell>
                    )}
                    {index === 0 && (
                      <TableCell rowSpan={employee.coursesEnrolled.length}>{employee.name}</TableCell>
                    )}
                    <TableCell>{course}</TableCell>
                    <TableCell>{employee.category[index]}</TableCell>
                    <TableCell>{new Date(0, employee.completionMonth[index] - 1).toLocaleString('default', { month: 'long' })}</TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </LocalizationProvider>
  );
};

export default EmployeeReport;
