

import React, { useState } from 'react';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Autocomplete from '@mui/material/Autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


const EmployeeReport = () => {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);


  const tableData = [
    { empID: '001', name: 'John', domain: 'Web Development', coursesEnrolled: ['React', 'Node.js', 'Express'], completionDate: '15-04-2024' },
    { empID: '002', name: 'Jane', domain: 'Data Science', coursesEnrolled: ['Machine Learning', 'Python'], completionDate: '01-05-2024' },
  ];


  const handleGenerateReport = () => {
    const doc = new jsPDF();


    doc.setFontSize(20);
    doc.text('Employee Report', 10, 10);


    doc.autoTable({
      head: [['EmpID', 'Name', 'Domain', 'Courses Enrolled', 'Completion Date']],
      body: (filteredData.length > 0 ? filteredData : tableData).map(row => [row.empID, row.name, row.domain, row.coursesEnrolled.join(', '), row.completionDate]),
      startY: 20
    });


    doc.save('report.pdf');
  };


  const handleSearch = () => {
    const filtered = tableData.filter(row => {

      const completionDate = new Date(row.completionDate);
      return (
        (!selectedMonth || completionDate.getMonth() === selectedMonth.getMonth()) &&
        (!selectedDomain || row.domain.toLowerCase().includes(selectedDomain.toLowerCase())) &&
        (!searchQuery || row.empID.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    setFilteredData(filtered);
  };
 
 


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        <Typography variant="h3" gutterBottom>
          Filter by:
        </Typography>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
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
          <Table id="table-to-pdf" aria-label="employee report table">
            <TableHead>
              <TableRow>
                <TableCell>EmpID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Courses Enrolled</TableCell>
                <TableCell>Completion Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(filteredData.length > 0 ? filteredData : tableData).map((row) => (
                <TableRow key={row.empID}>
                  <TableCell>{row.empID}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.domain}</TableCell>
                  <TableCell>{row.coursesEnrolled.join(', ')}</TableCell>
                  <TableCell>{row.completionDate}</TableCell>
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
