import 'chart.js/auto'; import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Typography, TextField, Rating } from '@mui/material'; // Import Modal, Typography, TextField, and Rating components from MUI
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AssignedCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (!(auth?.isAuthenticated)) navigate("/login");
  }, []);

  const [courses, setCourses] = useState([
    { name: 'Course 1', status: 'start', duration: '1 hrs' },
    { name: 'Course 2', status: 'start', duration: '2 hrs' },
    { name: 'Course 3', status: 'completed', duration: '1 hrs' },
    { name: 'Course 4', status: 'start', duration: '4 hrs' },
    { name: 'Course 5', status: 'completed', duration: '2.5 hrs' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false); // State variable for feedback dialog
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comments: '' }); // State variable for storing feedback data
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null); // State variable to store the index of the selected course

  const handleSelfAssessmentClick = (index) => {
    setSelectedCourseIndex(index); // Set the selected course index
    setModalOpen(true);
  };

  const handleCloseModal = (completed) => {
    if (completed) {
      const updatedCourses = [...courses];
      updatedCourses[selectedCourseIndex].status = 'completed';
      setCourses(updatedCourses);
      setFeedbackData({ rating: 0, comments: '' }); // Clear feedback data
      setModalOpen(false);
      setFeedbackOpen(true);
    } else {
      setModalOpen(false);
    }
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
  };

  const handleFeedbackSubmit = () => {
    // Implement your logic to submit feedback
    console.log(feedbackData); // For demonstration, log feedback data
    setFeedbackOpen(false);
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
    switch (status) {
      case 'start':
        return '#3498db'; // Blue
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
        <TableContainer style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
  <Table>
    <TableHead style={{ textAlign: 'center' }}>
      <TableRow>
        <TableCell>Course Name</TableCell>
        <TableCell>Duration</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {courses.map((course, index) => (
        <TableRow key={index}>
          <TableCell>{course.name}</TableCell>
          <TableCell>{course.duration}</TableCell>
          <TableCell>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: getStatusColor(course.status) }}>
              {course.status === 'start' && 'Yet to Start'}
              {course.status === 'completed' && 'Completed'}
            </Typography>
          </TableCell>
          <TableCell>
            {course.status === 'start' && (
              <Button variant="contained" style={{ backgroundColor: '#66388e', color: 'white', marginRight: '8px' }} onClick={() => handleSelfAssessmentClick(index)}>
                Self Assessment
              </Button>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      </div>

      <Modal open={modalOpen} onClose={() => handleCloseModal(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '40px', outline: 'none', borderRadius: '8px', width: '60%', maxWidth: '400px' }}>
          <Typography variant="h4" gutterBottom style={{ marginBottom: '30px' }}>
            Have you completed the course?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <Button variant="contained" style={{ width: '45%', backgroundColor: '#2ecc71', color: 'white', fontSize: '1.2rem' }} onClick={() => handleCloseModal(true)}>
              Yes
            </Button>
            <Button variant="contained" style={{ width: '45%', backgroundColor: '#e74c3c', color: 'white', fontSize: '1.2rem' }} onClick={() => handleCloseModal(false)}>
              No
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={feedbackOpen} onClose={handleFeedbackClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '40px', outline: 'none', borderRadius: '8px', width: '80%', maxWidth: '500px' }}>
          <Typography variant="h4" gutterBottom>
            Course Feedback
          </Typography>
          <div style={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1" gutterBottom>
              Rate the course:
            </Typography>
            <Rating
              name="course-rating"
              value={feedbackData.rating}
              onChange={(event, newValue) => setFeedbackData({ ...feedbackData, rating: newValue })}
              aria-required
            />
          </div>
          <TextField
            id="comments"
            label="Comments"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedbackData.comments}
            onChange={(event) => setFeedbackData({ ...feedbackData, comments: event.target.value })}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleFeedbackSubmit} disabled={feedbackData.rating === 0}>
              Submit
            </Button>
            <Button variant="contained" onClick={handleFeedbackClose} style={{ marginLeft: '10px' }}>
              Skip
            </Button>
          </div>
        </div>
      </Modal>


      <div className="pie-chart-section" style={{ marginTop: '-20px', textAlign: 'center', marginLeft: '50px' }}>
        <h2 style={{ paddingBottom: '20px', paddingTop: '20px' }}>Progress Tracker</h2>
        <div style={{ marginLeft: '40px', marginRight: '10px', display: 'inline-block' }} className="pie-chart-container">
          <Pie data={pieData} options={{
            plugins: {
              datalabels: {
                color: 'white',
                formatter: (value, context) => {
                  const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(0);
                  return `${percentage}%`;
                },
              },
            },
            legend: {
              display: true,
              position: 'bottom',
            },
          }} />
        </div>
      </div>

    </div>
  );
};

export default AssignedCourses;
