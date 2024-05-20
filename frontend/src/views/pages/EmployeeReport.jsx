import React, { useState, useRef } from 'react';
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
  ListItemText,
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

  const [employees, setEmployees] = useState([
    {
      empID: '001',
      name: 'John',
      category: ['Domain', 'Power', 'Technical'],
      coursesEnrolled: ['React', 'Node.js', 'Express'],
      completionMonth: [4, 5, 7],
    },
    {
      empID: '002',
      name: 'Jane',
      category: ['Domain', 'Power'],
      coursesEnrolled: ['Machine Learning', 'Python'],
      completionMonth: [5, 9],
    },
    {
      empID: '003',
      name: 'Doe',
      category: ['Power', 'Technical'],
      coursesEnrolled: ['Sketch', 'Figma'],
      completionMonth: [6, 6],
    },
    {
      empID: '004',
      name: 'Smith',
      category: ['Domain', 'Technical'],
      coursesEnrolled: ['HTML', 'CSS'],
      completionMonth: [7, 10],
    },
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
      December: 0,
    };
    employees.forEach((employee) => {
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

      const tableData = employees.map((employee) => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.category.join(', '),
        employee.completionMonth.map((month) =>
          new Date(0, month - 1).toLocaleString('default', { month: 'long' })
        ).join(', '),
      ]);

      doc.autoTable({
        head: [['EmpID', 'Name', 'Courses', 'Category', 'Completion Month']],
        body: tableData,
        startY: 20,
      });
      doc.addImage(chartImage, 'JPEG', 60, doc.autoTable.previous.finalY + 10, 80, 80); 

      doc.save('employee_report.pdf');
    } else if (format === 'xlsx') {
      const tableData1 = employees.reduce((acc, employee) => {
        employee.completionMonth.forEach((month, index) => {
          acc.push({
            EmpID: employee.empID,
            Name: employee.name,
            Courses: employee.coursesEnrolled[index],
            Category: employee.category[index],
            Month: new Date(0, month - 1).toLocaleString('default', { month: 'long' }),
          });
        });
        return acc;
      }, []);

      const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Report');
      XLSX.writeFile(wb, 'employee_report.xlsx');
    } else if (format === 'csv') {
      const tableData = employees.map((employee) => [
        employee.empID,
        employee.name,
        employee.coursesEnrolled.join(', '),
        employee.completionMonth.map((month) => new Date(0, month - 1).toLocaleString('default', { month: 'long' })).join(', '),
      ]);

      const csv = Papa.unparse({
        fields: ['EmpID', 'Name', 'Courses', 'Completion Month'],
        data: tableData,
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
    const filteredEmployees = employees.filter((employee) => {
      const matchingCourses = employee.coursesEnrolled.reduce((acc, course, index) => {
        const completionMonth = employee.completionMonth[index];
        if (
          (!selectedMonth || completionMonth === parseInt(selectedMonth)) &&
          (!selectedCategory || employee.category[index] === selectedCategory) &&
          (
            (!selectedQuarter) ||
            (selectedQuarter === 'Q1' && completionMonth >= 1 && completionMonth <= 3) ||
            (selectedQuarter === 'Q2' && completionMonth >= 4 && completionMonth <= 6) ||
            (selectedQuarter === 'Q3' && completionMonth >= 7 && completionMonth <= 9) ||
            (selectedQuarter === 'Q4' && completionMonth >= 10 && completionMonth <= 12) ||
            (selectedQuarter === 'H1' && (completionMonth >= 1 && completionMonth <= 6)) ||
            (selectedQuarter === 'H2' && (completionMonth >= 7 && completionMonth <= 12))
          )
        ) {
          acc.push({
            course,
            category: employee.category[index],
            completionMonth: new Date(0, completionMonth - 1).toLocaleString('default', { month: 'long' }),
          });
        }
        return acc;
      }, []);

      return (
        (!searchQueryName || employee.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || employee.empID.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        (matchingCourses.length > 0)
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
          Employee Report
        </Typography>
        <div className="employee-report-filters">
          <TextField
            select
            label="Filter"
            value={selectedFilter}
            onChange={handleFilterChange}
            style={{ marginRight: '10px' }}
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
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            style={{ marginRight: '10px' }}
          >
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
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
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

        <div style={{ display: 'flex',flex: '1', overflow: 'hidden', alignItems: 'flex-start' }}>
          <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 70%', overflowX: 'hidden', overflowY: 'auto' }}>
            <TableContainer style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  paddingRight: '8px', 
                  marginBottom: '-16px', 
                }}
                component={Paper}
                sx={{
                  maxHeight: '100%',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px', 
                    borderRadius: '3px', 
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#FFFFFF',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#eee6ff', 
                    borderRadius: '3px',
                  },
                }}>
              <Table aria-label="employee report table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">EmpID</TableCell>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Courses</TableCell>
                    <TableCell align="center">Category</TableCell>
                    <TableCell align="center">Completion Month</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => {
                    const matchingCourses = employee.coursesEnrolled.reduce((acc, course, index) => {
                      const completionMonth = employee.completionMonth[index];
                      if (
                        (!selectedMonth || completionMonth === parseInt(selectedMonth)) &&
                        (!selectedCategory || employee.category[index] === selectedCategory) &&
                        (
                          (!selectedQuarter) ||
                          (selectedQuarter === 'Q1' && completionMonth >= 1 && completionMonth <= 3) ||
                          (selectedQuarter === 'Q2' && completionMonth >= 4 && completionMonth <= 6) ||
                          (selectedQuarter === 'Q3' && completionMonth >= 7 && completionMonth <= 9) ||
                          (selectedQuarter === 'Q4' && completionMonth >= 10 && completionMonth <= 12) ||
                          (selectedQuarter === 'H1' && (completionMonth >= 1 && completionMonth <= 6)) ||
                          (selectedQuarter === 'H2' && (completionMonth >= 7 && completionMonth <= 12))
                        )
                      ) {
                        acc.push({
                          course,
                          category: employee.category[index],
                          completionMonth: new Date(0, completionMonth - 1).toLocaleString('default', { month: 'long' }),
                        });
                      }
                      return acc;
                    }, []);

                    let rows = [];
                    matchingCourses.forEach((course, index) => {
                      const completionMonth = course.completionMonth;
                      if (index === 0) {
                        rows.push(
                          <TableRow key={`${employee.empID}-${course.course}`}>
                            <TableCell align="center" rowSpan={matchingCourses.length}>{employee.empID}</TableCell>
                            <TableCell align="center" rowSpan={matchingCourses.length}>{employee.name}</TableCell>
                            <TableCell align="center">{course.course}</TableCell>
                            <TableCell align="center">{course.category}</TableCell>
                            <TableCell align="center">{completionMonth}</TableCell>
                          </TableRow>
                        );
                      } else {
                        rows.push(
                          <TableRow key={`${employee.empID}-${course.course}`}>
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

          <div style={{ flex: '1 0 30%', position: 'sticky', top: '-50px' }}>
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





