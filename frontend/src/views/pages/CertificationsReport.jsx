import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2'; // Import Bar from react-chartjs-2

import './EmployeeReport.css';

const CertificationsReport = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredCertifications, setFilteredCertifications] = useState([]);

  // Dummy certifications data
  const [certifications, setCertifications] = useState([
    { empid: 'INT-123', name: 'ABC', certifications: 'aws', category: 'technical', year: '2023' },
    { empid: 'INT-124', name: 'DEF', certifications: 'azure', category: 'technical', year: '2022' },
    { empid: '1235', name: 'GHI', certifications: 'aws', category: 'domain', year: '2023' },
    { empid: 'INT-113', name: 'JKL', certifications: 'aws', category: 'technical', year: '2023' },
    { empid: 'INT-224', name: 'MNO', certifications: 'aws', category: 'domain', year: '2022' },
    { empid: '7784', name: 'PQR', certifications: 'hippa', category: 'technical', year: '2023' },
    { empid: 'INT-013', name: 'JKKL', certifications: 'aws', category: 'technical', year: '2023' },
    { empid: 'INT-224', name: 'MNNO', certifications: 'agile', category: 'domain', year: '2022' },
    { empid: '7704', name: 'PQRR', certifications: 'agile', category: 'technical', year: '2023' },
    { empid: '7784', name: 'PQR', certifications: 'python', category: 'technical', year: '2023' },
    { empid: '2013', name: 'JKKL', certifications: 'spring', category: 'technical', year: '2023' },
    { empid: '6224', name: 'MNNO', certifications: 'java', category: 'domain', year: '2022' },
    { empid: '7804', name: 'PQRR', certifications: 'agile', category: 'technical', year: '2023' },
    { empid: '7704', name: 'PQRR', certifications: 'email', category: 'technical', year: '2023' },
    { empid: '7784', name: 'PQR', certifications: 'public speaking', category: 'technical', year: '2023' },
    { empid: '2013', name: 'JKKL', certifications: 'react', category: 'technical', year: '2023' },
    { empid: '6224', name: 'MNNO', certifications: 'git', category: 'domain', year: '2022' },
    { empid: '7804', name: 'PQRR', certifications: 'business report', category: 'technical', year: '2023' },
    // Add more dummy data here
  ]);

  const handleGenerateReport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Certifications Report', 10, 10);

      // Generate PDF content
      const tableRows = [];
      filteredCertifications.forEach((certification) => {
        tableRows.push([
          certification.empid,
          certification.name,
          certification.certifications,
          certification.category,
          certification.year
        ]);
      });

      doc.autoTable({
        head: [['EmpID', 'Name', 'Certifications', 'Category', 'Year']],
        body: tableRows
      });

      // Save PDF
      doc.save('certifications_report.pdf');
    } else if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(filteredCertifications);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Certifications Report');
      XLSX.writeFile(wb, 'certifications_report.xlsx');
    } else if (format === 'csv') {
      const csv = Papa.unparse(filteredCertifications);
      const csvContent = `data:text/csv;charset=utf-8,${csv}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'certifications_report.csv');
      document.body.appendChild(link);
      link.click();
    }
  };

  // Extract unique years and categories from certifications data
  const years = ['All', ...Array.from(new Set(certifications.map(certification => certification.year)))];
  const categories = ['All', ...Array.from(new Set(certifications.map(certification => certification.category)))];

  useEffect(() => {
    filterCertifications();
  }, [selectedYear, selectedCategory, searchQueryID, searchQueryName]);

  const filterCertifications = () => {
    let filteredData = certifications;

    if (selectedYear && selectedYear !== 'All') {
      filteredData = filteredData.filter(certification => certification.year === selectedYear);
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filteredData = filteredData.filter(certification => certification.category === selectedCategory);
    }

    if (searchQueryID) {
      filteredData = filteredData.filter(certification => certification.empid.toLowerCase().includes(searchQueryID.toLowerCase()));
    }

    if (searchQueryName) {
      filteredData = filteredData.filter(certification => certification.name.toLowerCase().includes(searchQueryName.toLowerCase()));
    }

    setFilteredCertifications(filteredData);
  };

  const handleSearch = () => {
    const filteredEmployees = employees?.filter((employee) => {
      const matchingCourses = employee.coursesEnrolled.reduce((acc, course, index) => {
        const completionMonth = employee.completionMonth[index];
        if (
          (!selectedYear || certification.year === selectedYear) &&
          (!selectedMonth || completionMonth === parseInt(selectedMonth)) &&
          (!selectedCategory || employee.category[index] === selectedCategory)
        ) {
          acc.push({
            course,
            category: employee.category[index],
            completionMonth: new Date(0, completionMonth - 1).toLocaleString('default', { month: 'long' })
          });
        }
        return acc;
      }, []);

      return (
        (!searchQueryName || employee.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || employee.empID.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        matchingCourses.length > 0
      );
    });

    setEmployees(filteredEmployees);
  };

  const handleFilterChange = (event) => {
    setSelectedYear(event.target.value);
  };

  // Prepare data for bar chart
  const certificationCounts = certifications.reduce((acc, certification) => {
    acc[certification.certifications] = (acc[certification.certifications] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(certificationCounts),
    datasets: [
      {
        label: 'Number of Employees',
        data: Object.values(certificationCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Employees'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Certifications'
        }
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom style={{ marginBottom: '30px' }}>
          Certifications Report
        </Typography>
        <div className="employee-report-filters" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            options={categories}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                style={{ marginRight: '10px' }}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  style: { paddingRight: '10px' }, // Match padding of other TextFields
                }}
              />
            )}
            clearOnEscape={false}
            clearIcon={null}
          />
          <TextField
            label="Search by ID"
            value={searchQueryID}
            onChange={(e) => setSearchQueryID(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Search by Name"
            value={searchQueryName}
            onChange={(e) => setSearchQueryName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button
            variant="contained"
            endIcon={<DownloadIcon />}
            onClick={(event) => setDownloadAnchorEl(event.currentTarget)}
            style={{ marginRight: '10px' }}
          >
            Download
          </Button>
          <Popover
            open={Boolean(downloadAnchorEl)}
            anchorEl={downloadAnchorEl}
            onClose={() => setDownloadAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <List>
              <ListItem button onClick={() => handleGenerateReport('pdf')}>
                <ListItemText primary="PDF" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('xlsx')}>
                <ListItemText primary="Excel" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('csv')}>
                <ListItemText primary="CSV" />
              </ListItem>
            </List>
          </Popover>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flex: '1', width: '100%', overflow: 'hidden', alignItems: 'flex-start' }}>
            <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 100%', overflowX: 'hidden', overflowY: 'auto' }}>
              <TableContainer
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  paddingRight: '8px', // Adjust padding to accommodate scrollbar width
                  marginBottom: '-16px' // Compensate for the added padding to avoid double scrollbars
                }}
                component={Paper}
                sx={{
                  width: '100%',
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
                <Table aria-label="certifications report table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">EmpID</TableCell>
                      <TableCell align="center">Name</TableCell>
                      <TableCell align="center">Certifications</TableCell>
                      <TableCell align="center">Category</TableCell>
                      <TableCell align="center">Year</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertifications.map((certification, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">{certification.empid}</TableCell>
                        <TableCell align="center">{certification.name}</TableCell>
                        <TableCell align="center">{certification.certifications}</TableCell>
                        <TableCell align="center">{certification.category}</TableCell>
                        <TableCell align="center">{certification.year}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <div style={{ width: '80%', marginBottom: '20px', marginTop: '30px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CertificationsReport;
