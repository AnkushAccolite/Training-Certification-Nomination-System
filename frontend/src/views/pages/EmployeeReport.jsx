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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';

import './EmployeeReport.css';

const EmployeeReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);

  const chartRef = useRef(null);
  const categories = ['Domain', 'Power', 'Technical', 'Process'];
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  const [months] = useState([
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
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');

    const fetchData = async () => {
      try {
        const { data } = await axios.get('/employee/employeeReport');

        const temp = data
          ?.map((item) => ({
            empID: item?.empId,
            name: item?.empName,
            category: item?.completedCourses?.map((course) => course?.domain),
            coursesEnrolled: item?.completedCourses?.map((course) => course?.courseName),
            completionMonth: item?.completedCourses?.map((course) => parseInt(course?.date?.substring(3, 5))),
            completionYear: item?.completedCourses?.map((course) => parseInt(course?.date?.substring(6)))
          }))
          .filter((employee) => employee?.coursesEnrolled?.length !== 0);

        setEmployees(temp);
        setFilteredEmployees(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate, months]);

  useEffect(() => {
    filterEmployees();
  }, [selectedMonth, selectedCategory, selectedQuarter, searchQueryID, searchQueryName]);

  const filterEmployees = () => {
    let filteredData = employees;

    if (selectedMonth) {
      filteredData = filteredData.filter((employee) => employee.completionMonth.some((month) => month === parseInt(selectedMonth)));
    }

    if (selectedCategory) {
      filteredData = filteredData.filter((employee) => employee.category.some((category) => category === selectedCategory));
    }

    if (selectedQuarter) {
      filteredData = filteredData.filter((employee) =>
        employee.completionMonth.some((month) => {
          const quarterStart = {
            Q1: 1,
            Q2: 4,
            Q3: 7,
            Q4: 10,
            H1: 1,
            H2: 7
          }[selectedQuarter];

          const quarterEnd = {
            Q1: 3,
            Q2: 6,
            Q3: 9,
            Q4: 12,
            H1: 6,
            H2: 12
          }[selectedQuarter];

          return month >= quarterStart && month <= quarterEnd;
        })
      );
    }

    if (searchQueryID) {
      filteredData = filteredData.filter((employee) => employee.empID.toLowerCase().includes(searchQueryID.toLowerCase()));
    }

    if (searchQueryName) {
      filteredData = filteredData.filter((employee) => employee.name.toLowerCase().includes(searchQueryName.toLowerCase()));
    }

    setFilteredEmployees(filteredData);
  };

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

    filteredEmployees?.forEach((employee) => {
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
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#D29CC5',
            '#FF5733',
            '#66FF33',
            '#337DFF',
            '#AB33FF',
            '#FF33E3',
            '#33FFA8',
            '#FFBD33',
            '#33FFD8'
          ]
        }
      ]
    };

    return { data };
  };

  const { data } = generatePieChartData();

  const handleGenerateReport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Employee Report', 10, 10);

      const tableData = filteredEmployees?.map((employee) => [
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

      doc.save('employee_report.pdf');
    } else if (format === 'xlsx') {
      const tableData1 = filteredEmployees?.reduce((acc, employee) => {
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
      const tableData = filteredEmployees?.map((employee) => [
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ textAlign: 'center' }}>
        <h2>Employee Report</h2>
        <div className="employee-report-filters">
          <TextField
            select
            label="Filter"
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            style={{ marginRight: '10px' }}
          >
            <MenuItem value="Monthly">Monthly</MenuItem>
            <MenuItem value="Quarterly">Quarterly</MenuItem>
            <MenuItem value="HalfYearly">Half Yearly</MenuItem>
            {/* <MenuItem value="Yearly">Yearly</MenuItem> */}
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
          {selectedFilter === 'Quarterly' && (
            <TextField
              select
              label="Quarter"
              value={selectedQuarter}
              onChange={(event) => setSelectedQuarter(event.target.value)}
              style={{ marginRight: '10px' }}
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
              style={{ marginRight: '10px' }}
            >
              <MenuItem value="H1">First Half (Jan - Jun)</MenuItem>
              <MenuItem value="H2">Second Half (Jul - Dec)</MenuItem>
            </TextField>
          )}
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
                  style: { paddingRight: '10px' }
                }}
              />
            )}
            clearOnEscape={false}
            clearIcon={null}
          />
          <TextField
            label="Search by ID"
            value={searchQueryID}
            onChange={(event) => setSearchQueryID(event.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Search by Name"
            value={searchQueryName}
            onChange={(event) => setSearchQueryName(event.target.value)}
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
              <ListItem
                button
                onClick={() => {
                  handleGenerateReport('pdf');
                  setDownloadAnchorEl(null);
                }}
              >
                <ListItemText primary=" PDF" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleGenerateReport('xlsx');
                  setDownloadAnchorEl(null);
                }}
              >
                <ListItemText primary=" XLSX" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  handleGenerateReport('csv');
                  setDownloadAnchorEl(null);
                }}
              >
                <ListItemText primary=" CSV" />
              </ListItem>
            </List>
          </Popover>
        </div>

        <div style={{ display: 'flex', flex: '1', overflow: 'hidden', alignItems: 'flex-start' }}>
          <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 70%', overflowX: 'hidden', overflowY: 'auto' }}>
            <TableContainer
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                paddingRight: '8px',
                marginBottom: '-16px'
              }}
              component={Paper}
              sx={{
                maxHeight: '100%',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                  borderRadius: '3px'
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#FFFFFF'
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#eee6ff',
                  borderRadius: '3px'
                }
              }}
            >
              <Table aria-label="employee report table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                      Employee ID
                    </TableCell>
                    <TableCell align="center" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                      Name
                      {/* <ArrowDropDownIcon style={{ fontSize: '130%' }} /> */}
                    </TableCell>
                    <TableCell align="center" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                      Courses
                    </TableCell>
                    <TableCell align="center" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                      Category
                    </TableCell>
                    <TableCell align="center" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                      Completion Month
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees?.map((employee, employeeIndex) => {
                    const matchingCourses = employee.coursesEnrolled.reduce((acc, course, index) => {
                      const completionMonth = employee.completionMonth[index];
                      if (
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

                    let rows = [];
                    matchingCourses.forEach((course, index) => {
                      const completionMonth = course.completionMonth;
                      if (index === 0) {
                        rows.push(
                          <TableRow
                            key={`${employee.empID}-${course.course}`}
                            style={{ backgroundColor: employeeIndex % 2 === 0 ? '#f2f2f2' : 'white' }}
                          >
                            <TableCell align="center" rowSpan={matchingCourses.length}>
                              {employee.empID}
                            </TableCell>
                            <TableCell align="center" rowSpan={matchingCourses.length}>
                              {employee.name}
                            </TableCell>
                            <TableCell align="center">{course.course}</TableCell>
                            <TableCell align="center">{course.category}</TableCell>
                            <TableCell align="center">{completionMonth}</TableCell>
                          </TableRow>
                        );
                      } else {
                        rows.push(
                          <TableRow
                            key={`${employee.empID}-${course.course}`}
                            style={{ backgroundColor: employeeIndex % 2 === 0 ? '#f2f2f2' : 'white' }}
                          >
                            <TableCell align="center">{course.course}</TableCell>
                            <TableCell align="center">{course.category}</TableCell>
                            <TableCell align="center">{completionMonth}</TableCell>
                          </TableRow>
                        );
                      }
                    });

                    return matchingCourses.length > 0 ? rows : null;
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div style={{ flex: '1 0 30%', position: 'sticky', top: '-50px', marginRight: '40px' }}>
            <Typography variant="h4" gutterBottom>
              Completion Months Chart
            </Typography>
            <div style={{ width: '100%', height: '290px' }}>
              <Pie data={data} />
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default EmployeeReport;
