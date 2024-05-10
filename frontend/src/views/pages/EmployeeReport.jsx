import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 

const EmployeeReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([
    { empID: '001', name: 'John', domain: 'Web Development', coursesEnrolled: ['React', 'Node.js', 'Express'], completionMonth: 4 },
    { empID: '002', name: 'Jane', domain: 'Data Science', coursesEnrolled: ['Machine Learning', 'Python'], completionMonth: 5 },
  ]);

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Employee Report', 10, 10);
  
    const tableData = employees.map(employee => [
      employee.empID,
      employee.name,
      employee.domain,
      employee.coursesEnrolled.join(', '),
      new Date(0, employee.completionMonth - 1).toLocaleString('default', { month: 'long' })
    ]);
  
    doc.autoTable({
      head: [['EmpID', 'Name', 'Domain', 'Courses Enrolled', 'Completion Month']],
      body: tableData,
      startY: 20 
    });
    doc.save('employee_report.pdf');
  };
  

  const handleSearch = () => {
    const filteredEmployees = employees.filter(employee => {
      return (!selectedMonth || employee.completionMonth.toString() === selectedMonth) &&
        (!selectedDomain || employee.domain.toLowerCase().includes(selectedDomain.toLowerCase())) &&
        (!searchQuery || employee.empID.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedQuarter === '' || (selectedQuarter === 'Q1' && employee.completionMonth >= 1 && employee.completionMonth <= 3) ||
        (selectedQuarter === 'Q2' && employee.completionMonth >= 4 && employee.completionMonth <= 6) ||
        (selectedQuarter === 'Q3' && employee.completionMonth >= 7 && employee.completionMonth <= 9) ||
        (selectedQuarter === 'Q4' && employee.completionMonth >= 10 && employee.completionMonth <= 12) ||
        (selectedQuarter === 'H1' && employee.completionMonth >= 1 && employee.completionMonth <= 6) ||
        (selectedQuarter === 'H2' && employee.completionMonth >= 7 && employee.completionMonth <= 12));
    });
    setEmployees(filteredEmployees);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h2" gutterBottom style={{ display: 'flex', marginBottom: '30px' }}>
          Employee Report
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
            label="Search by Employee ID"
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
          <Table aria-label="employee report table">
            <TableHead>
              <TableRow>
                <TableCell>EmpID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Courses Enrolled</TableCell>
                <TableCell>Completion Month</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.empID}>
                  <TableCell>{employee.empID}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.domain}</TableCell>
                  <TableCell>{employee.coursesEnrolled.join(', ')}</TableCell>
                  <TableCell>{new Date(0, employee.completionMonth - 1).toLocaleString('default', { month: 'long' })}</TableCell>

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

export default EmployeeReport;
