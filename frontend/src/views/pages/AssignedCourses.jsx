import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import '../../App.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'; // Import Table components from MUI
import cardImg from '../../assets/images/icons/image.png';
import Typography from '@mui/material/Typography';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { PieChartOutline } from '@mui/icons-material';

const AssignedCourses = () => {
  const cardImageHeight = 180;

  const navigate = useNavigate();
  const auth = useSelector(state=>state.auth);

  useEffect(() => {
    if(!(auth?.isAuthenticated))navigate("/login");
  }, []);

  const [courses, setCourses] = useState([
    { name: 'Course 1', status: 'start' },
    { name: 'Course 2', status: 'inprogress' },
    { name: 'Course 3', status: 'completed' },
    { name: 'Course 4', status: 'start' },
    { name: 'Course 5', status: 'completed' },
  ]);

  const updateCourseStatus = (index, newStatus) => {
    const updatedCourses = [...courses];
    updatedCourses[index].status = newStatus;
    setCourses(updatedCourses);
  };

  const countByStatus = () => {
    return courses.reduce((acc, course) => {
      acc[course.status] = (acc[course.status] || 0) + 1;
      return acc;
    }, {});
  };

  const [chartData, setChartData] = useState(countByStatus());

  useEffect(() => {
    setChartData(countByStatus());
  }, [courses]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'start':
        return '#3498db'; // Blue
      case 'inprogress':
        return '#f1c40f'; // Yellow
      case 'completed':
        return '#2ecc71'; // Green
      default:
        return '#000'; // Default color
    }
  };

  const pieData = {
    labels: Object.keys(chartData),
    datasets: [{
      data: Object.values(chartData),
      backgroundColor: Object.keys(chartData).map(status => getStatusColor(status)),
    }]
  };

  return (
    <div className="container">
      <div className="courses-section">
        <h2>Courses</h2>
        <TableContainer style={{ backgroundColor: 'white' }}> {/* Set background color of TableContainer to white */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: getStatusColor(course.status) }}>
                    {course.status === 'start' && 'Yet to Start'}
                    {course.status === 'inprogress' && 'In Progress'}
                    {course.status === 'completed' && 'Completed'}
                  </TableCell> {/* Set font weight to bold and color based on status */}
                  <TableCell>
                    {course.status === 'start' && (
                      <Button variant="contained" style={{ backgroundColor: '#3498db', color: 'white', marginRight: '8px' }} onClick={() => updateCourseStatus(index, 'inprogress')}>Start Course</Button>
                    )}
                    {course.status === 'inprogress' && (
                      <Button variant="contained" style={{ backgroundColor: '#f1c40f', color: 'white', marginRight: '8px' }}>In Progress</Button>
                    )}
                    {course.status === 'completed' && (
                      <Button variant="contained" style={{ backgroundColor: '#2ecc71', color: 'white', marginRight: '8px' }}>Go to Course</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="pie-chart-section" style={{ marginTop: '-20px', textAlign: 'left' }}>
  <h2 style={{ textAlign: 'left' ,paddingBottom: '20px' }}>Progress Tracker</h2>
  <div style={{ textAlign: 'left' , marginLeft: '-40px', marginRight: '40px'}} className="pie-chart-container">
    <Pie data={pieData} options={{
      plugins: {
        datalabels: {
          color: 'white',
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(0);
            return `${percentage}%`;
          }
        }
      },
      legend: {
        display: true,
        position: 'bottom', // Place legend at the bottom
      }
    }} />
  </div>
</div>

    </div>
  );
};

export default AssignedCourses;
