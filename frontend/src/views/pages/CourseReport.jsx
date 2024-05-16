// import 'chart.js/auto';
// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, Popover, List, ListItem, ListItemText } from '@mui/material';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import SearchIcon from '@mui/icons-material/Search';
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
// import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import Autocomplete from '@mui/material/Autocomplete';
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import * as XLSX from 'xlsx';
// import Papa from 'papaparse';

// const CourseReport = () => {
//   const [selectedFilter, setSelectedFilter] = useState('');
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [selectedQuarter, setSelectedQuarter] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [searchQueryID, setSearchQueryID] = useState('');
//   const [searchQueryName, setSearchQueryName] = useState('');
//   const [downloadAnchorEl, setDownloadAnchorEl] = useState(null); // State for anchor element of popover
//   const [courses, setCourses] = useState([
//     { courseId: 'C001', name: 'Course 1', category: 'Power', employeesEnrolled: 10, completionMonth: 4, employeesCompleted: 6 },
//     { courseId: 'C002', name: 'Course 2', category: 'Process', employeesEnrolled: 15, completionMonth: 5, employeesCompleted: 12 },
//     { courseId: 'C003', name: 'Course 3', category: 'Technical', employeesEnrolled: 20, completionMonth: 4, employeesCompleted: 18 },
//     { courseId: 'C004', name: 'Course 4', category: 'Domain', employeesEnrolled: 25, completionMonth: 7, employeesCompleted: 20 },
//   ]);

//   const calculateAttendance = (completed, enrolled) => {
//     return Math.round((completed / enrolled) * 100);
//   };

//   useEffect(() => {
//     handleSearch(); 
//   }, [selectedMonth, selectedQuarter, selectedCategory, searchQueryID, searchQueryName]);

//   const generateChartData = () => {
//     const data = {
//       labels: courses.map(course => course.name),
//       datasets: [
//         {
//           label: 'Attendance %',
//           backgroundColor: 'rgba(75,192,192,1)',
//           borderColor: 'rgba(0,0,0,1)',
//           borderWidth: 1,
//           hoverBackgroundColor: 'rgba(75,192,192,0.4)',
//           hoverBorderColor: 'rgba(0,0,0,1)',
//           data: courses.map(course => calculateAttendance(course.employeesCompleted, course.employeesEnrolled)),
//         }
//       ]
//     };
//     return data;
//   };

//   const handleGenerateReport = (format) => {
//     const doc = new jsPDF();
//     doc.setFontSize(20);
//     doc.text('Course Report', 10, 10);
  
//     const tableData = courses.map(course => [
//       course.courseId,
//       course.name,
//       course.category,
//       course.employeesEnrolled,
//       course.employeesCompleted,
//       `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`,
//       getMonthName(course.completionMonth)
//     ]);
  
//     const tableData1 = courses.map(course => ({
//       'Course ID': course.courseId,
//       'Name': course.name,
//       'Category': course.category,
//       'Employees Enrolled': course.employeesEnrolled,
//       'Employees Completed': course.employeesCompleted,
//       'Attendance': `${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`,
//       'Completion Month': getMonthName(course.completionMonth)
//     }));
  
  
//     const chartCanvas = document.querySelector('canvas');
//     const chartImage = chartCanvas.toDataURL('image/jpeg');
  
//     switch (format) {
//       case 'pdf':
//         doc.autoTable({
//           head: [['Course ID', 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month']],
//           body: tableData,
//           startY: 20
//         });
  
        
//         doc.addImage(chartImage, 'JPEG', 10, doc.autoTable.previous.finalY + 10, 180, 100); // Adjust position and dimensions as needed
//         doc.save('course_report.pdf');
//         break;
//       case 'excel':
//         const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'Course Report');
//         XLSX.writeFile(wb, 'course_report.xlsx');
//         break;
//       case 'csv':
//         const csv = Papa.unparse({
//           fields: ['Course ID', 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month'],
//           data: tableData
//         });
//         const csvContent = `data:text/csv;charset=utf-8,${csv}`;
//         const encodedUri = encodeURI(csvContent);
//         const link = document.createElement('a');
//         link.setAttribute('href', encodedUri);
//         link.setAttribute('download', 'course_report.csv');
//         document.body.appendChild(link);
//         link.click();
//         break;
//     }
//   };

//   const getMonthName = (month) => {
//     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//     return monthNames[month - 1];
//   };

//   const handleSearch = () => {
//     const filteredCourses = courses.filter(course => {
//       return ((!selectedMonth || course.completionMonth.toString() === selectedMonth) &&
//         (!selectedCategory || course.category.toLowerCase() === selectedCategory.toLowerCase()) &&
//         (!searchQueryName || course.name.toLowerCase().includes(searchQueryName.toLowerCase())) &&
//         (!searchQueryID || course.courseId.toLowerCase().includes(searchQueryID.toLowerCase())) &&
//         (selectedQuarter === '' || (selectedQuarter === 'Q1' && course.completionMonth >= 1 && course.completionMonth <= 3) ||
//           (selectedQuarter === 'Q2' && course.completionMonth >= 4 && course.completionMonth <= 6) ||
//           (selectedQuarter === 'Q3' && course.completionMonth >= 7 && course.completionMonth <= 9) ||
//           (selectedQuarter === 'Q4' && course.completionMonth >= 10 && course.completionMonth <= 12) ||
//           (selectedQuarter === 'H1' && course.completionMonth >= 1 && course.completionMonth <= 6) ||
//           (selectedQuarter === 'H2' && course.completionMonth >= 7 && course.completionMonth <= 12)));
//     });
//     setCourses(filteredCourses);
//   };

//   const handleFilterChange = (event) => {
//     setSelectedFilter(event.target.value);
//   };

//   const handleDownloadClick = (event) => {
//     setDownloadAnchorEl(event.currentTarget);
//   };

//   const handleDownloadClose = () => {
//     setDownloadAnchorEl(null);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <div>
//         <Typography variant="h2" gutterBottom style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           Course Report
//           <Button
//             variant="contained"
//             endIcon={<GetAppIcon />}
//             onClick={handleDownloadClick}
//           >
//             Download
//           </Button>
//           <Popover
//             open={Boolean(downloadAnchorEl)}
//             anchorEl={downloadAnchorEl}
//             onClose={handleDownloadClose}
//             anchorOrigin={{
//               vertical: 'bottom',
//               horizontal: 'right',
//             }}
//             transformOrigin={{
//               vertical: 'top',
//               horizontal: 'right',
//             }}
//           >
//             <List>
//               <ListItem button onClick={() => handleGenerateReport('pdf')}>
//                 <ListItemText primary="Download as PDF" />
//               </ListItem>
//               <ListItem button onClick={() => handleGenerateReport('excel')}>
//                 <ListItemText primary="Download as XLSX" />
//               </ListItem>
//               <ListItem button onClick={() => handleGenerateReport('csv')}>
//                 <ListItemText primary="Download as CSV" />
//               </ListItem>
//             </List>
//           </Popover>
//         </Typography>
//         <Typography variant="h3" gutterBottom>
//           Filter by:
//         </Typography>
//         <div style={{ display: 'flex', marginBottom: '30px' }}>
//           <TextField
//             select
//             label="Filter"
//             value={selectedFilter}
//             onChange={handleFilterChange}
//             style={{ width: '200px', marginRight: '10px' }}
//           >
//            <MenuItem value="Monthly">Monthly</MenuItem>
//             <MenuItem value="Quarterly">Quarterly</MenuItem>
//             <MenuItem value="HalfYearly">Half Yearly</MenuItem>
//             <MenuItem value="Yearly">Yearly</MenuItem>
//           </TextField>
//           {selectedFilter === 'Monthly' && (
//             <TextField
//               select
//               label="Month"
//               value={selectedMonth}
//               onChange={(event) => setSelectedMonth(event.target.value)}
//               style={{ width: '200px', marginRight: '10px' }}
//             >
//               {Array.from({ length: 12 }, (_, index) => (
//                 <MenuItem key={index + 1} value={(index + 1).toString()}>
//                   {new Date(0, index).toLocaleString('default', { month: 'long' })}
//                 </MenuItem>
//               ))}
//             </TextField>
//           )}
//           {selectedFilter === 'Quarterly' && (
//             <TextField
//               select
//               label="Quarter"
//               value={selectedQuarter}
//               onChange={(event) => setSelectedQuarter(event.target.value)}
//               style={{ width: '200px', marginRight: '10px' }}
//             >
//               <MenuItem value="Q1">Quarter 1 (Jan - Mar)</MenuItem>
//               <MenuItem value="Q2">Quarter 2 (Apr - Jun)</MenuItem>
//               <MenuItem value="Q3">Quarter 3 (Jul - Sep)</MenuItem>
//               <MenuItem value="Q4">Quarter 4 (Oct - Dec)</MenuItem>
//             </TextField>
//           )}
//           {selectedFilter === 'HalfYearly' && (
//             <TextField
//               select
//               label="Half Year"
//               value={selectedQuarter}
//               onChange={(event) => setSelectedQuarter(event.target.value)}
//               style={{ width: '200px', marginRight: '10px' }}
//             >
//               <MenuItem value="H1">First Half (Jan - Jun)</MenuItem>
//               <MenuItem value="H2">Second Half (Jul - Dec)</MenuItem>
//             </TextField>
//           )}
//           <Autocomplete
//             options={['Power', 'Process', 'Technical', 'Domain']}
//             value={selectedCategory}
//             onChange={(event, newValue) => setSelectedCategory(newValue)}
//             renderInput={(params) => <TextField {...params} label="Category" style={{ width: '200px', marginRight: '10px' }} />}
//           />
//           <TextField
//             label="Search by Course ID"
//             value={searchQueryID}
//             onChange={(e) => setSearchQueryID(e.target.value)}
//             style={{ width: '300px', marginRight: '10px' }}
//           />
//           <TextField
//             label="Search by Course Name"
//             value={searchQueryName}
//             onChange={(e) => setSearchQueryName(e.target.value)}
//             style={{ width: '300px', marginRight: '10px' }}
//           />
//           <Button
//             variant="contained"
//             startIcon={<SearchIcon />}
//             onClick={handleSearch}
//           >
//             Search
//           </Button>
//         </div>
//         <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
//           <Table aria-label="course report table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Course ID</TableCell>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Employees Enrolled</TableCell>
//                 <TableCell>Employees Completed</TableCell>
//                 <TableCell>Attendance</TableCell>
//                 <TableCell>Completion Month</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {courses.map((course) => (
//                 <TableRow key={course.courseId}>
//                   <TableCell>{course.courseId}</TableCell>
//                   <TableCell>{course.name}</TableCell>
//                   <TableCell>{course.category}</TableCell>
//                   <TableCell>{course.employeesEnrolled}</TableCell>
//                   <TableCell>{course.employeesCompleted}</TableCell>
//                   <TableCell>{`${calculateAttendance(course.employeesCompleted, course.employeesEnrolled)}%`}</TableCell>
//                   <TableCell>{getMonthName(course.completionMonth)}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <Typography variant="h3" gutterBottom>
//           Course Attendance Chart
//         </Typography>
//         <div style={{ width: '500px', height: '300px', margin: 'auto' }}>
//   <Bar
//     data={generateChartData()}
//     options={{
//       maintainAspectRatio: false,
//       scales: {
//         yAxes: [{
//           ticks: {
//             beginAtZero: true
//           }
//         }]
//       }
//     }}
//   />
//   </div>
//       </div>
//     </LocalizationProvider>
//   );
// };

// export default CourseReport;



import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
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
    { 
      courseId: 'C001', 
      name: 'Course 1', 
      category: 'Power', 
      data: [
        { 
          employeesEnrolled: 10, 
          employeesCompleted: 6, 
          attendance: 60, 
          completionMonth: 4 
        },
        { 
          employeesEnrolled: 20, 
          employeesCompleted: 15, 
          attendance: 75, 
          completionMonth: 8 
        }
      ]
    },
    { 
      courseId: 'C002', 
      name: 'Course 2', 
      category: 'Process', 
      data: [
        { 
          employeesEnrolled: 15, 
          employeesCompleted: 12, 
          attendance: 80, 
          completionMonth: 5 
        },
        { 
          employeesEnrolled: 10, 
          employeesCompleted: 9, 
          attendance: 90, 
          completionMonth: 8 
        }

      ]
    },
    { 
      courseId: 'C003', 
      name: 'Course 3', 
      category: 'Technical', 
      data: [
        { 
          employeesEnrolled: 20, 
          employeesCompleted: 18, 
          attendance: 90, 
          completionMonth: 4 
        }
      ]
    },
    { 
      courseId: 'C004', 
      name: 'Course 4', 
      category: 'Domain', 
      data: [
        { 
          employeesEnrolled: 25, 
          employeesCompleted: 20, 
          attendance: 80, 
          completionMonth: 7 
        }
      ]
    },
  ]);

  const calculateAttendance = (completed, enrolled) => {
    return Math.round((completed / enrolled) * 100);
  };

  useEffect(() => {
    handleSearch(); 
  }, [selectedMonth, selectedQuarter, selectedCategory, searchQueryID, searchQueryName]);

  const generateChartData = () => {
    const data = {
      labels: courses.map(course => course.name),
      datasets: [
        {
          label: 'Attendance %',
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(0,0,0,1)',
          data: courses.map(course => {
            const totalData = course.data.reduce((acc, cur) => {
              return acc + calculateAttendance(cur.employeesCompleted, cur.employeesEnrolled);
            }, 0);
            return Math.round(totalData / course.data.length);
          }),
        }
      ]
    };
    return data;
  };

  const handleGenerateReport = (format) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('Course Report', 10, 10);
  
    const tableData = courses.map(course => {
      return course.data.map(data => [
        course.courseId,
        course.name,
        course.category,
        data.employeesEnrolled,
        data.employeesCompleted,
        `${calculateAttendance(data.employeesCompleted, data.employeesEnrolled)}%`,
        getMonthName(data.completionMonth)
      ]);
    }).flat();
  
    const tableData1 = courses.map(course => {
      return course.data.map(data => ({
        'Course ID': course.courseId,
        'Name': course.name,
        'Category': course.category,
        'Employees Enrolled': data.employeesEnrolled,
        'Employees Completed': data.employeesCompleted,
        'Attendance': `${calculateAttendance(data.employeesCompleted, data.employeesEnrolled)}%`,
        'Completion Month': getMonthName(data.completionMonth)
      }));
    }).flat();
  
    const chartCanvas = document.querySelector('canvas');
    const chartImage = chartCanvas.toDataURL('image/jpeg');
  
    switch (format) {
      case 'pdf':
        doc.autoTable({
          head: [['Course ID', 'Name', 'Category', 'Employees Enrolled', 'Employees Completed', 'Attendance', 'Completion Month']],
          body: tableData,
          startY: 20
        });
  
        
        doc.addImage(chartImage, 'JPEG', 10, doc.autoTable.previous.finalY + 10, 180, 100); // Adjust position and dimensions as needed
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
      const matchingEmployees = course.data.reduce((acc, data,index) => {
        const completionMonth = data.completionMonth[index];
        if (
          (!selectedMonth || data.completionMonth.toString() === selectedMonth) &&
          (!selectedCategory || course.category.toLowerCase() === selectedCategory.toLowerCase()) &&
          (
            (!selectedQuarter) ||
            (selectedQuarter === 'Q1' && data.completionMonth >= 1 && data.completionMonth <= 3) ||
            (selectedQuarter === 'Q2' && data.completionMonth >= 4 && data.completionMonth <= 6) ||
            (selectedQuarter === 'Q3' && data.completionMonth >= 7 && data.completionMonth <= 9) ||
            (selectedQuarter === 'Q4' && data.completionMonth >= 10 && data.completionMonth <= 12) ||
            (selectedQuarter === 'H1' && (data.completionMonth >= 1 && data.completionMonth <= 6)) ||
            (selectedQuarter === 'H2' && (data.completionMonth >= 7 && data.completionMonth <= 12))
          )
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
        (matchingEmployees.length > 0)
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
        <TableContainer component={Paper} style={{ marginBottom: '30px' }}>
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
  {courses.map((course) => {
    const matchingCourses = course.data.filter((data) => {
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

    if (matchingCourses.length > 0) {
      const rows = matchingCourses.map((data, index) => {
        const completionMonth = getMonthName(data.completionMonth);
        if (index === 0) {
          return (
            <TableRow key={`${course.courseId}_${index}`}>
              <TableCell rowSpan={matchingCourses.length}>{course.courseId}</TableCell>
              <TableCell rowSpan={matchingCourses.length}>{course.name}</TableCell>
              <TableCell rowSpan={matchingCourses.length}>{course.category}</TableCell>
              <TableCell>{data.employeesEnrolled}</TableCell>
              <TableCell>{data.employeesCompleted}</TableCell>
              <TableCell>{`${calculateAttendance(data.employeesCompleted, data.employeesEnrolled)}%`}</TableCell>
              <TableCell>{completionMonth}</TableCell>
            </TableRow>
          );
        } else {
          return (
            <TableRow key={`${course.courseId}_${index}`}>
              <TableCell>{data.employeesEnrolled}</TableCell>
              <TableCell>{data.employeesCompleted}</TableCell>
              <TableCell>{`${calculateAttendance(data.employeesCompleted, data.employeesEnrolled)}%`}</TableCell>
              <TableCell>{completionMonth}</TableCell>
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
        <Typography variant="h3" gutterBottom>
          Course Attendance Chart
        </Typography>
        <div style={{ width: '500px', height: '300px', margin: 'auto' }}>
          <Bar
            data={generateChartData()}
            options={{
              maintainAspectRatio: false,
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CourseReport;
