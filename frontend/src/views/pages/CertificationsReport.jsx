import React, { useState, useRef, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  Button,
  Paper,
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
  ListItemText
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

import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';

import './EmployeeReport.css';


const CertificationsReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const chartRef = useRef(null);

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  const [months, setMonths] = useState([
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER'
  ]);

  const [employees, setEmployees] = useState([]);

  //   useEffect(() => {
  //     if (!auth?.isAuthenticated) navigate('/login');

  //     const fetchData = async () => {
  //       try {
  //         const { data } = await axios.get('/employee/employeeReport');

  //         const temp = data
  //           ?.map((item) => ({
  //             empID: item?.empId,
  //             name: item?.empName,
  //             category: item?.completedCourses?.map((course) => course?.category),
  //             coursesEnrolled: item?.completedCourses?.map((course) => course?.courseName),
  //             completionMonth: item?.completedCourses?.map((course) => months.indexOf(course?.month) + 1)
  //           }))
  //           .filter((employee) => employee?.coursesEnrolled?.length !== 0);

  //         setEmployees(temp);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchData();
  //   }, [auth, navigate]);

  useEffect(() => {
    if (!(auth?.isAuthenticated)) navigate("/login");
  }, [auth, navigate]);

  // Dummy certifications data
  const [certifications, setCertifications] = useState([
    { empid: 'INT-123', name: 'ABC', certifications: 'aws', category: 'technical', price: '10000', year: '2023' },
    { empid: 'INT-124', name: 'DEF', certifications: 'azure', category: 'technical', price: '12000', year: '2022' },
    { empid: '1235', name: 'GHI', certifications: 'aws', category: 'domain', price: '9000', year: '2023' },
    { empid: 'INT-113', name: 'JKL', certifications: 'aws', category: 'technical', price: '10000', year: '2023' },
    { empid: 'INT-224', name: 'MNO', certifications: 'aws', category: 'domain', price: '12000', year: '2022' },
    { empid: '7784', name: 'PQR', certifications: 'aws', category: 'technical', price: '9000', year: '2023' },
    // Add more dummy data here
  ]);

  const generatePieChartData = () => {
    const completionCounts = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0
    };

    employees?.forEach((employee) => {
      employee.completionMonth.forEach((month) => {
        const roundedMonth = parseInt(month);
        const monthName = new Date(0, roundedMonth - 1).toLocaleString('default', { month: 'long' });
        completionCounts[monthName]++;
      });
    });

    const data = {
      labels: Object.keys(completionCounts),
      datasets: [
        {
          label: 'Completion Months',
          data: Object.values(completionCounts),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#D29CC5', '#FF5733',
            '#66FF33', '#337DFF', '#AB33FF', '#FF33E3', '#33FFA8',
            '#FFBD33', '#33FFD8',
          ],
        },
      ],
    };

    return { data };
  };

  const { data } = generatePieChartData();

  const handleGenerateReport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Employee Report', 10, 10);
      const chartCanvas = document.querySelector('canvas');
      chartCanvas.style.backgroundColor = 'white';
      const chartImage = chartCanvas.toDataURL('image/jpeg');

      const tableData = employees?.map((employee) => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.category.join(', '),
        employee.completionMonth.map((month) => new Date(0, month - 1).toLocaleString('default', { month: 'long' })).join(', ')
      ]);

      doc.autoTable({
        head: [['EmpID', 'Name', 'Courses', 'Category', 'Completion Month']],
        body: tableData,
        startY: 20
      });
      doc.addImage(chartImage, 'JPEG', 60, doc.autoTable.previous.finalY + 10, 80, 80);

      doc.save('employee_report.pdf');
    } else if (format === 'xlsx') {
      const tableData1 = employees?.reduce((acc, employee) => {
        employee.completionMonth.forEach((month, index) => {
          acc.push({
            EmpID: employee.empID,
            Name: employee.name,
            Courses: employee.coursesEnrolled[index],
            Category: employee.category[index],
            Month: new Date(0, month - 1).toLocaleString('default', { month: 'long' })
          });
        });
        return acc;
      }, []);

      const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
      XLSX.writeFile(wb, 'employee_report.xlsx');
    } else if (format === 'csv') {
      const tableData = employees?.map((employee) => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.completionMonth.map((month) => new Date(0, month - 1).toLocaleString('default', { month: 'long' })).join(', ')
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

  const handleSearch = () => {
    const filteredEmployees = employees?.filter((employee) => {
      const matchingCourses = employee.coursesEnrolled.reduce((acc, course, index) => {
        const completionMonth = employee.completionMonth[index];
        if (
          (!selectedYear || certification.year === selectedYear) &&
          (!selectedMonth || completionMonth === parseInt(selectedMonth)) &&
          (!selectedCategory || employee.category[index] === selectedCategory) &&
          (!selectedQuarter ||
            (selectedQuarter === 'Q1' && completionMonth >= 1 && completionMonth <= 3) ||
            (selectedQuarter === 'Q2' && completionMonth >= 4 && completionMonth <= 6) ||
            (selectedQuarter === 'Q3' && completionMonth >= 7 && completionMonth <= 9) ||
            (selectedQuarter === 'Q4' && completionMonth >= 10 && completionMonth <= 12) ||
            (selectedQuarter === 'H1' && completionMonth >= 1 && completionMonth <= 6) ||
            (selectedQuarter === 'H2' && completionMonth >= 7 && completionMonth <= 12))
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
    setSelectedFilter(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom style={{ marginBottom: '30px' }}>
          Certifications Report
        </Typography>
        <div className="employee-report-filters">
          <TextField
            select
            label="Filter"
            value={selectedFilter}
            onChange={handleFilterChange}
            style={{ marginRight: '10px' }}
          >
          </TextField>
          {selectedFilter === 'Monthly' && (
            <TextField
              select
              label="Month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              style={{ marginRight: '10px' }}
            >
              {Array.from({ length: 12 }, (_, index) => (
                <MenuItem key={index + 1} value={(index + 1).toString()}>
                  {new Date(0, index).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Autocomplete
            options={['Domain', 'Power', 'Technical', 'Process']}
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
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} style={{ marginRight: '10px' }}>
            Search
          </Button>
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

        <div style={{ display: 'flex', flex: '1', overflow: 'hidden', alignItems: 'flex-start' }}>
          <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 70%', overflowX: 'hidden', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flex: '1', overflow: 'hidden', alignItems: 'flex-start' }}>
              <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 70%', overflowX: 'hidden', overflowY: 'auto' }}>
                <TableContainer style={{ backgroundColor: 'white' }}>
                  <Table aria-label="certifications report table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">EmpID</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Certifications</TableCell>
                        <TableCell align="center">Category</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Year</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {certifications.map((certification, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{certification.empid}</TableCell>
                          <TableCell align="center">{certification.name}</TableCell>
                          <TableCell align="center">{certification.certifications}</TableCell>
                          <TableCell align="center">{certification.category}</TableCell>
                          <TableCell align="center">{certification.price}</TableCell>
                          <TableCell align="center">{certification.year}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </div>

            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CertificationsReport;
