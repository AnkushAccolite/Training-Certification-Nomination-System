import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import '../../App.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea, Button } from '@mui/material'; // Import Button from MUI
import cardImg from '../../assets/images/icons/image.png';

const AssignedCourses = () => {
  const cardImageHeight = 180;

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

  const CourseCard = ({ name, status, index }) => {
    const handleStartCourse = () => {
      if (status === 'start') {
        updateCourseStatus(index, 'inprogress');
        const newData = countByStatus();
        setChartData(newData);
      }
    };
  
    const handleGoToCourse = () => {
      console.log(`Navigating to course: ${name}`);
    };
  
    return (
      <Card sx={{ maxWidth: 345, marginBottom: '20px' }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height={cardImageHeight}
            image={cardImg}
            alt="Course Image"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" style={{ textAlign: 'center' }}>
              {name}
            </Typography>
            <div style={{ textAlign: 'center' }}>
              {status === 'start' && (
                <Button onClick={handleStartCourse} variant="contained" style={{ backgroundColor: '#3498db', marginRight: '8px' }}>Start Course</Button>
              )}
              {status === 'inprogress' && (
                <Button onClick={handleGoToCourse} variant="contained" style={{ backgroundColor: '#8e44ad', marginRight: '8px' }}>Go to Course</Button>
              )}
            </div>
            <Typography variant="body2" color="text.secondary" style={{ textAlign: 'center' }}>
              <b>Status:</b> {status}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

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
        <div className="course-cards">
          {courses.map((course, index) => (
            <CourseCard key={index} name={course.name} status={course.status} index={index} />
          ))}
        </div>
      </div>
      <div className="pie-chart-section">
        <h2 style={{ textAlign: 'center' }}>Progress Tracker</h2>
        <div className="pie-chart-container">
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
