import 'chart.js/auto';
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Typography,
  TextField,
  Rating
} from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import getNominationCourses from 'utils/getNominationCourses';
import getAllCourses from 'utils/getAllCourses';
import axios from '../../api/axios';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const AssignedCourses = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const [courses, setCourses] = useState([]);

  const [assignedCoursesStatus, setAssignedCoursesStatus] = useState({
    approvedCourses: [],
    completedCourses: []
  });

  const fetchData = async () => {
    try {
      const nominationCourses = await getNominationCourses(auth?.user?.empId);
      const approvedCourseIds = nominationCourses?.approvedCourses?.map((course) => course.courseId);
      const completedCourseIds = nominationCourses?.completedCourses?.map((course) => course.courseId);

      const allCourses = await getAllCourses();

      setAssignedCoursesStatus({
        approvedCourses: approvedCourseIds,
        completedCourses: completedCourseIds
      });

      const temp = allCourses
        .filter((item) => approvedCourseIds?.includes(item?.courseId) || completedCourseIds?.includes(item?.courseId))
        .map((item) => ({
          id: item?.courseId,
          name: item?.courseName,
          status: completedCourseIds?.includes(item?.courseId) ? 'completed' : 'start',
          duration: item?.duration
        }));

      setCourses(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');
    fetchData();
  }, [auth, navigate]);

  const [modalOpen, setModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comments: '' });
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSelfAssessmentClick = (id, index) => {
    setSelectedCourseId(id);
    setSelectedCourseIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = (completed) => {
    if (completed) {
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleFeedbackSubmit = async () => {
    try {
      const feedback = {
        empId: auth?.user?.empId,
        empName: auth?.user?.empName,
        courseId: selectedCourseId,
        rating: feedbackData?.rating,
        comment: feedbackData?.comments
      };
      const res = await axios.post(`/course/completed?empId=${feedback.empId}&courseId=${selectedCourseId}`, feedback);
      setFeedbackOpen(false);
      setSnackbarOpen(true);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'courseName') {
        return a.name.localeCompare(b.name) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'duration') {
        return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }
    return 0;
  });

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

  const pieData = Object.keys(chartData).map((status) => ({
    name: status,
    value: chartData[status],
    percentage: ((chartData[status] / courses.length) * 100).toFixed(1) + '%'
  }));

  return (
    <div className="container">
      <div className="content-section" style={{ display: 'flex' }}>
        <div className="courses-section" style={{ flex: '0 1 70%', marginRight: '20px', textAlign: 'center' }}>
          <h2 style={{ paddingBottom: '20px', textAlign: 'center' }}>Assigned Courses</h2>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <div style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
              {sortedCourses.length === 0 ? (
                <div
                  style={{
                    width: '100%',
                    height: '70%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'white',
                    borderRadius: '15px',
                    letterSpacing: '1px'
                  }}
                >
                  <b>No Courses Assigned for this month</b>
                </div>
              ) : (
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
                  <Table stickyHeader>
                    <TableHead style={{ textAlign: 'center' }}>
                      <TableRow>
                        <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('courseName')}>
                          <div
                            style={{
                              display: 'flex',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            Course Name
                            {sortConfig.key === 'courseName' ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                              ) : (
                                <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                              )
                            ) : (
                              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('duration')}>
                          <div
                            style={{
                              display: 'flex',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            Duration (hrs)
                            {sortConfig.key === 'duration' ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                              ) : (
                                <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                              )
                            ) : (
                              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedCourses?.map((course, index) => (
                        <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#F2F2F2' : 'white' }}>
                          <TableCell style={{ textAlign: 'center' }}>{course?.name}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{course?.duration}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            <Typography variant="body1" style={{ fontWeight: 'bold', color: getStatusColor(course.status) }}>
                              {course?.status === 'start' && 'Yet to Start'}
                              {course?.status === 'completed' && 'Completed'}
                            </Typography>
                          </TableCell>
                          <TableCell style={{ textAlign: 'center' }}>
                            {course?.status === 'start' && (
                              <Button
                                variant="contained"
                                style={{ backgroundColor: '#3498db', color: 'white', marginRight: '8px' }}
                                onClick={() => handleSelfAssessmentClick(course?.id, index)}
                              >
                                Self Assessment
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </div>
        </div>

        <div className="pie-chart-section" style={{ flex: '0 1 30%', position: 'sticky', marginTop: '7%', top: 20 }}>
          <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '-60px', fontSize: '18px' }}>
            Progress Tracker
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={105}
                fill="#8884D8"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                      {`${Math.round(percent * 100)}%`}
                    </text>
                  );
                }}
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

      {/* Modal for Self Assessment */}
      <Modal open={modalOpen} onClose={() => handleCloseModal(false)}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '40px',
            outline: 'none',
            borderRadius: '8px',
            width: '60%',
            maxWidth: '400px'
          }}
        >
          <Typography variant="h4" gutterBottom style={{ fontSize: '24px', textAlign: 'center' }}>
            Self Assessment
          </Typography>
          <Typography variant="subtitle1" gutterBottom style={{ fontSize: '18px', textAlign: 'center' }}>
            Have you completed the course?
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '25px' }}>
            <Button
              variant="contained"
              style={{ width: '45%', backgroundColor: '#2ecc71', color: 'white', fontSize: '1rem' }}
              onClick={() => handleCloseModal(true)}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              style={{ width: '45%', backgroundColor: '#e74c3c', color: 'white', fontSize: '1rem' }}
              onClick={() => handleCloseModal(false)}
            >
              No
            </Button>
          </div>
        </div>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Thank you for submitting your feedback!
        </MuiAlert>
      </Snackbar>

      <Modal open={feedbackOpen} onClose={handleFeedbackClose}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '40px',
            outline: 'none',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '500px'
          }}
        >
          <Typography variant="h4" gutterBottom style={{ fontSize: '24px', textAlign: 'center' }}>
            Course Feedback
          </Typography>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontSize: '18px' }}>
              Rate the course: <span style={{ color: '#3453cf', fontWeight: 'bold' }}>{courses[selectedCourseIndex]?.name}</span>{' '}
            </Typography>
            <div style={{ display: 'inline-block' }}>
              <Rating
                name="course-rating"
                value={feedbackData.rating}
                onChange={(event, newValue) => setFeedbackData({ ...feedbackData, rating: newValue })}
                aria-required
                size="large"
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
            <Button variant="contained" onClick={handleFeedbackSubmit} style={{ marginLeft: '10px' }}>
              Skip
            </Button>
          </div>
        </div>
      </Modal>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Thank you for submitting your feedback!
        </MuiAlert>
      </Snackbar>
    </div>
  );
};
export default AssignedCourses;
