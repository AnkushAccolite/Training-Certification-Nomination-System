import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import '../../App.css';
import cardImg from '../../assets/images/icons/image.png';
import Typography from '@mui/material/Typography';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
// import { PieChartOutline } from '@mui/icons-material';

const AssignedCourses = () => {
  const [courses, setCourses] = useState([
    { name: 'Course 1', status: 'start' },
    { name: 'Course 2', status: 'inprogress' },
    { name: 'Course 3', status: 'completed' },
    { name: 'Course 4', status: 'start' }
    // Add more courses as needed
  ]);

  // Function to update course status
  const updateCourseStatus = (index, newStatus) => {
    const updatedCourses = [...courses];
    updatedCourses[index].status = newStatus;
    setCourses(updatedCourses);
  };

  // Count the number of courses for each status
  const countByStatus = () => {
    return courses.reduce((acc, course) => {
      acc[course.status] = (acc[course.status] || 0) + 1;
      return acc;
    }, {});
  };

  // State for chart data
  const [chartData, setChartData] = useState(countByStatus());

  // Update chart data when courses change
  useEffect(() => {
    setChartData(countByStatus());
  }, [courses]);

  const CourseCard = ({ name, status, index }) => {
    const handleStartCourse = () => {
      if (status === 'start') {
        updateCourseStatus(index, 'inprogress');
        // Update chart data
        const newData = countByStatus();
        setChartData(newData);
      }
    };

    const handleGoToCourse = () => {
      // Add logic to handle navigation to the course
      console.log(`Navigating to course: ${name}`);
    };

    // Define button color based on status
    let buttonColor = '';
    switch (status) {
      case 'start':
        buttonColor = '#3498db'; // Blue
        break;
      case 'inprogress':
        buttonColor = '#8e44ad'; // Purple
        break;
      case 'completed':
        buttonColor = '#2ecc71'; // Green
        break;
      default:
        buttonColor = '#000'; // Default color
    }

    return (
      <div className={`course-card ${status}`}>
        <img src={cardImg} alt="Course" style={{ width: '100%', maxWidth: '200px' }} />
        <h3>{name}</h3>
        {status === 'start' && (
          <button onClick={handleStartCourse} style={{ backgroundColor: buttonColor }} className="start-button">
            Start Course
          </button>
        )}
        {status === 'inprogress' && (
          <button onClick={handleGoToCourse} style={{ backgroundColor: buttonColor }} className="go-to-button">
            Go to Course
          </button>
        )}
        <p>
          <b>
            Status: <span style={{ color: '#000' }}>{status}</span>
          </b>
        </p>
      </div>
    );
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
        {/* <h2>Course Status</h2> */}
        <Typography variant="h2" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          <PieChartOutlineIcon sx={{ marginRight: '10px' }} />
          Employee Report
        </Typography>
        <div className="pie-chart-container">
          <Pie
            data={{
              labels: Object.keys(chartData),
              datasets: [
                {
                  data: Object.values(chartData),
                  backgroundColor: ['#3498db', '#8e44ad', '#2ecc71'] // Blue, Purple, Green
                }
              ]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignedCourses;
