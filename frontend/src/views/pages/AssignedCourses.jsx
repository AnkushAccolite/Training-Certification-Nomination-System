import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Typography, TextField, Rating } from '@mui/material'; // Import Modal, Typography, TextField, and Rating components from MUI
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AssignedCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (!(auth?.isAuthenticated)) navigate("/login");
  }, []);

  const [courses, setCourses] = useState([
    { name: 'Course 1', status: 'start', duration: '1' },
    { name: 'Course 2', status: 'start', duration: '2' },
    { name: 'Course 3', status: 'completed', duration: '1' },
    { name: 'Course 4', status: 'start', duration: '4' },
    { name: 'Course 5', status: 'completed', duration: '2.5' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false); // State variable for feedback dialog
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comments: '' }); // State variable for storing feedback data
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null); // State variable to store the index of the selected course
  const [snackbarOpen, setSnackbarOpen] = useState(false);


  const handleSelfAssessmentClick = (index) => {
    setSelectedCourseIndex(index); // Set the selected course index
    setModalOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
    setSnackbarOpen(true); // Open the Snackbar
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
        <TableCell style={{textAlign: 'center'}}>Course Name</TableCell>
        <TableCell style={{textAlign: 'center'}}>Duration (hrs)</TableCell>
        <TableCell style={{textAlign: 'center'}}>Status</TableCell>
        <TableCell style={{textAlign: 'center'}}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {courses.map((course, index) => (
        <TableRow key={index}>
          <TableCell style={{textAlign: 'center'}}>{course.name}</TableCell>
          <TableCell style={{textAlign: 'center'}}>{course.duration}</TableCell>
          <TableCell style={{textAlign: 'center'}}>
            <Typography variant="body1" style={{ fontWeight: 'bold', color: getStatusColor(course.status) }}>
              {course.status === 'start' && 'Yet to Start'}
              {course.status === 'completed' && 'Completed'}
            </Typography>
          </TableCell>
          <TableCell style={{textAlign: 'center'}}>
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
          <Typography variant="h4" gutterBottom style={{ fontSize: '24px', textAlign: 'center' }}>
            Self Assessment
          </Typography>
          <Typography variant="subtitle1" gutterBottom style={{ fontSize: '18px', textAlign: 'center' }}>
            Have you completed the course?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
            <Button variant="contained" style={{ width: '45%', backgroundColor: '#2ecc71', color: 'white', fontSize: '1rem' }} onClick={() => handleCloseModal(true)}>
              Yes
            </Button>
            <Button variant="contained" style={{ width: '45%', backgroundColor: '#e74c3c', color: 'white', fontSize: '1rem' }} onClick={() => handleCloseModal(false)}>
              No
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={feedbackOpen} onClose={handleFeedbackClose}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '40px', outline: 'none', borderRadius: '8px', width: '80%', maxWidth: '500px' }}>
          <Typography variant="h4" gutterBottom style={{ fontSize: '24px', textAlign: 'center' }}>
            Course Feedback
          </Typography>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontSize: '18px' }}>
              Rate the course: <span style={{ color: '#3453cf', fontWeight: 'bold' }}>{courses[selectedCourseIndex]?.name}</span> {/* Display course name in blue */}
            </Typography>
            <div style={{ display: 'inline-block' }}>
              <Rating
                name="course-rating"
                value={feedbackData.rating}
                onChange={(event, newValue) => setFeedbackData({ ...feedbackData, rating: newValue })}
                aria-required
                size="large" // Set the size of the stars to large
              />
            </div>
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

      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000} // Duration for the Snackbar to remain open (3 seconds)
  onClose={handleSnackbarClose}
>
  <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
    Thank you for submitting your feedback!
  </MuiAlert>
</Snackbar>



      <div className="pie-chart-section">
        
        <div style={{ marginLeft: '20px', marginRight: '10px', display: 'inline-block' }} className="pie-chart-container">
        <h2 style={{textAlign:'center'}}>Progress Tracker</h2>
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