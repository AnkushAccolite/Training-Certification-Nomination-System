import 'chart.js/auto';
import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import { Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Typography, TextField, Rating } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AssignedCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (!(auth?.isAuthenticated)) navigate("/login");
  }, [auth, navigate]);

  const [courses, setCourses] = useState([
    { name: 'Course 1', status: 'start', duration: '1' },
    { name: 'Course 2', status: 'start', duration: '2' },
    { name: 'Course 3', status: 'completed', duration: '1' },
    { name: 'Course 4', status: 'start', duration: '4' },
    { name: 'Course 5', status: 'completed', duration: '2.5' },
    { name: 'Course 6', status: 'completed', duration: '2.5' },
    { name: 'Course 7', status: 'completed', duration: '2.5' },
    { name: 'Course 8', status: 'completed', duration: '2.5' },
    { name: 'Course 9', status: 'completed', duration: '2.5' },
    { name: 'Course 10', status: 'completed', duration: '2.5' },
    { name: 'Course 11', status: 'completed', duration: '2.5' },
    { name: 'Course 12', status: 'completed', duration: '2.5' },

  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comments: '' });
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

  const handleSelfAssessmentClick = (index) => {
    setSelectedCourseIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = (completed) => {
    if (completed) {
      const updatedCourses = [...courses];
      updatedCourses[selectedCourseIndex].status = 'completed';
      setCourses(updatedCourses);
      setFeedbackData({ rating: 0, comments: '' });
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
    console.log(feedbackData);
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
        return '#3498db';
      case 'completed':
        return '#2ecc71';
      default:
        return '#000';
    }
  };

  const pieData = Object.keys(chartData).map(status => ({
    name: status,
    value: chartData[status],
  }));

  return (
    <div className="container">
      <div className="content-section" style={{ display: 'flex' }}>
        <div className="courses-section" style={{ flex: '0 1 70%', marginRight: '20px', textAlign: 'center' }}>
          <h2 style={{ paddingBottom: '20px' }}>Assigned Courses</h2>
          <div style={{ flex: '1', overflow: 'hidden' }}>
  <div style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
  <TableContainer
      style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        paddingRight: '8px', // Adjust padding to accommodate scrollbar width
        marginBottom: '-16px', // Compensate for the added padding to avoid double scrollbars
      }} 
      component={Paper} 
      sx={{ 
        maxHeight: '100%', 
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px', // Reduce width of the scrollbar
          borderRadius: '3px', // Round scrollbar corners
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#FFFFFF', // Background color of the scrollbar track
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#fffff', // Color of the scrollbar thumb (handle)
          borderRadius: '3px', // Round scrollbar thumb corners
        },
      }}
    >
              <Table stickyHeader>
                <TableHead style={{ textAlign: 'center' }}>
                  <TableRow>
                    <TableCell style={{ textAlign: 'center' }}>Course Name</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Duration(Hours)</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Status</TableCell>
                    <TableCell style={{ textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses.map((course, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ textAlign: 'center' }}>{course.name}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>{course.duration}</TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        <Typography variant="body1" style={{ fontWeight: 'bold', color: getStatusColor(course.status) }}>
                          {course.status === 'start' && 'Yet to Start'}
                          {course.status === 'completed' && 'Completed'}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ textAlign: 'center' }}>
                        {course.status === 'start' && (
                          <Button variant="contained" style={{ backgroundColor: '#3498db', color: 'white', marginRight: '8px' }} onClick={() => handleSelfAssessmentClick(index)}>
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
          </div>
        </div>

        <div className="pie-chart-section" style={{ flex: '0 1 30%', position: 'sticky', top: 20 }}>
          <Typography variant="h4" style={{ textAlign: 'center', marginTop: '30%' }}>
            Progress Tracker
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="40%"
                outerRadius={105}
                fill="#8884D8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
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
    </div>
  );
}
export default AssignedCourses;