import React, { useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import items from 'menu-items/items';
import axios from '../../api/axios';
import { TwelveMp } from '@mui/icons-material';

import './EmployeeReport.css';
import { useEffect } from 'react';

const CourseReport = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');

  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null); 

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  const [courses, setCourses] = useState([]);

  const calculateAttendance = (completed, enrolled) => {
    return Math.round((completed / enrolled) * 100);
  };

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

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');

    const fetchData = async () => {
      try {
        const { data } = await axios.get('course/courseReport');

        const temp = data
          ?.map((item) => ({
            courseId: item?.courseId,
            name: item?.courseName,
            category: item?.category,
            monthlyDetails: item?.monthlyDetails?.map((employee) => ({
              employeesEnrolled: employee?.employeesEnrolled,
              employeesCompleted: employee?.employeesCompleted,
              attendance: employee?.attendance,
              completionMonth: months.indexOf(employee?.month) + 1
            }))
          }))
          .filter((course) => course?.monthlyDetails?.length !== 0);

        setCourses(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate]);

  useEffect(() => {
    handleSearch();
  }, [selectedMonth, selectedQuarter, selectedCategory, searchQueryID, searchQueryName]);

  const generateChartData = () => {
    const colors = [
      '#00C49F',
      '#D29CC5',
      '#777777',
      '#842593',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)'
    ];

    const data = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    courses.forEach((course, index) => {
      const totalAttendance = course.monthlyDetails.reduce(
        (acc, cur) => acc + calculateAttendance(cur.employeesCompleted, cur.employeesEnrolled),
        0
      );
      const averageAttendance = Math.round(totalAttendance / course.monthlyDetails.length);
      data.labels.push(course.name);
      data.datasets[0].data.push(averageAttendance);
      data.datasets[0].backgroundColor.push(colors[index]);
    });

    return data;
  };
  const handleGenerateReport = (format) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Course Report', 10, 10);

    const tableData = courses
      .map((course) => {
        return course.monthlyDetails.map((data) => [
          
          course.name,
          course.category,
          data.employeesEnrolled,
          data.employeesCompleted,
          `${data.attendance}%`,
          getMonthName(data.completionMonth)
        ]);
      })
      .flat();

    const tableData1 = courses
      .map((course) => {
        return course.monthlyDetails.map((data) => ({
          Name: course.name,
          Category: course.category,
          'Employees Enrolled': data.employeesEnrolled,
          'Employees Completed': data.employeesCompleted,
          Attendance: `${data.attendance}%`,
          'Completion Month': getMonthName(data.completionMonth)
        }));
      })
      .flat();

   
    switch (format) {
      case 'pdf':
        doc.autoTable({
          head: [[ 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month']],
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
          fields: ['Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month'],
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
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[month - 1];
  };

  const handleSearch = () => {
    const filteredCourses = courses.filter((course) => {
      const matchingEmployees = course.monthlyDetails.reduce((acc, data, index) => {
        const completionMonth = data.completionMonth[index];
        if (
          (!selectedMonth || data.completionMonth.toString() === selectedMonth) &&
          (!selectedCategory || course.category.toLowerCase() === selectedCategory.toLowerCase()) &&
          (!selectedQuarter ||
            (selectedQuarter === 'Q1' && data.completionMonth >= 1 && data.completionMonth <= 3) ||
            (selectedQuarter === 'Q2' && data.completionMonth >= 4 && data.completionMonth <= 6) ||
            (selectedQuarter === 'Q3' && data.completionMonth >= 7 && data.completionMonth <= 9) ||
            (selectedQuarter === 'Q4' && data.completionMonth >= 10 && data.completionMonth <= 12) ||
            (selectedQuarter === 'H1' && data.completionMonth >= 1 && data.completionMonth <= 6) ||
            (selectedQuarter === 'H2' && data.completionMonth >= 7 && data.completionMonth <= 12))
        ) {
          acc.push({
            courseName: course.name,
            courseId: course.courseId,
            category: course.category,
            completionMonth: getMonthName(data.completionMonth)
          });
        }
        return acc;
      }, []);

      return (
        (!searchQueryName || course.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || course.courseId.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        matchingEmployees.length > 0
      );
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
      <div style={{ textAlign: 'center' }}>
        <h2>Course Report</h2>
        <div className="employee-report-filters">
          <TextField select label="Filter" value={selectedFilter} onChange={handleFilterChange} style={{ marginRight: '10px' }}>
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
                  style: { paddingRight: '10px' }
                }}
              />
            )}
            clearOnEscape={false}
            clearIcon={null}
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
              <ListItem button onClick={() => handleGenerateReport('excel')}>
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
              <Table aria-label="course report table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Employees Enrolled</TableCell>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Employees Completed</TableCell>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Attendance</TableCell>
                    <TableCell align="center"style={{ fontSize: '16px', fontWeight: 'bold' }}>Completion Month</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
  {courses?.map((course, courseIndex) => {
    const matchingDetails = course.monthlyDetails.filter((data) => {
      const completionMonth = getMonthName(data.completionMonth);
      return (
        (!selectedMonth || data.completionMonth.toString() === selectedMonth) &&
        (!selectedCategory || course.category.toLowerCase() === selectedCategory.toLowerCase()) &&
        (!searchQueryName || course.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
        (!searchQueryID || course.courseId.toLowerCase().includes(searchQueryID.toLowerCase())) &&
        (!selectedQuarter ||
          (selectedQuarter === 'Q1' && data.completionMonth >= 1 && data.completionMonth <= 3) ||
          (selectedQuarter === 'Q2' && data.completionMonth >= 4 && data.completionMonth <= 6) ||
          (selectedQuarter === 'Q3' && data.completionMonth >= 7 && data.completionMonth <= 9) ||
          (selectedQuarter === 'Q4' && data.completionMonth >= 10 && data.completionMonth <= 12) ||
          (selectedQuarter === 'H1' && data.completionMonth >= 1 && data.completionMonth <= 6) ||
          (selectedQuarter === 'H2' && data.completionMonth >= 7 && data.completionMonth <= 12))
      );
    });

    if (matchingDetails.length > 0) {
      const rows = matchingDetails.map((data, detailIndex) => {
        const completionMonth = getMonthName(data.completionMonth);
        const rowColorStyle = courseIndex % 2 === 0 ? { backgroundColor: '#f5f5f5' } : { backgroundColor: 'white' }; 

        if (detailIndex === 0) {
          return (
            <TableRow key={`${course.courseId}_${detailIndex}`} style={rowColorStyle}>
              <TableCell align="center" rowSpan={matchingDetails.length}>
                {course.name}
              </TableCell>
              <TableCell align="center" rowSpan={matchingDetails.length}>
                {course.category}
              </TableCell>
              <TableCell align="center">{data.employeesEnrolled}</TableCell>
              <TableCell align="center">{data.employeesCompleted}</TableCell>
              <TableCell align="center">{`${data.attendance}%`}</TableCell>
              <TableCell align="center">{completionMonth}</TableCell>
            </TableRow>
          );
        } else {
          return (
            <TableRow key={`${course.courseId}_${detailIndex}`} style={rowColorStyle}>
              <TableCell align="center">{data.employeesEnrolled}</TableCell>
              <TableCell align="center">{data.employeesCompleted}</TableCell>
              <TableCell align="center">{`${data.attendance}%`}</TableCell>
              <TableCell align="center">{completionMonth}</TableCell>
            </TableRow>
          );
        }
      });

      return rows;
    } else {
      return null;
    }
  })}
</TableBody>

              </Table>
            </TableContainer>
          </div>
          <div style={{ flex: '1 0 30%', position: 'sticky', top: '-50px', marginLeft: '50px', marginRight: '-10px', marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom style={{ marginLeft: '-70px' }}>
              Course Attendance Chart
            </Typography>
            <div style={{ width: '100%', height: '250px', marginTop: '10px' }}>
              <Pie
                data={generateChartData()}
                options={{
                  plugins: {
                    datalabels: {
                      display: true,
                      formatter: (value, ctx) => {
                        return ctx.chart.data.labels[ctx.dataIndex] + '\n' + value + '%';
                      },
                      color: '#fff',
                      font: {
                        weight: 'bold'
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CourseReport;
