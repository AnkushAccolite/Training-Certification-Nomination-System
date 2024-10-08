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
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import UploadWidget from 'ui-component/UploadWidget';
import axios from '../../api/axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';

function CertificationsApproved() {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');
  }, [auth, navigate]);

  const [certifications, setCertifications] = useState([]);

  const getStatus = (status) => {
    if (status === 'inProgress') return 'Ongoing';
    if (status === 'completed') return 'Passed';
    return 'Failed';
  };

  const fetchData = async () => {
    const { data } = await axios.get(`/certifications/employee/${auth?.user?.empId}`);
    const res = await axios.get('/certifications/all');
    const allCertifications = res.data;

    const approvedCertifications = data?.certifications?.map((item) => ({
      certificationId: item?.certificationId,
      name: allCertifications?.find((cert) => cert?.certificationId === item?.certificationId)?.name,
      status: getStatus(item?.status),
      attempts: item?.attempt
    }));
    setCertifications(approvedCertifications);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 0, comments: '' });
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [url, setUrl] = useState('');
  const [fileName, setFilename] = useState('');
  const [index, setIndex] = useState(null);

  const handleSelfAssessmentClick = (id, index) => {
    setSelectedCertification(id);
    setIndex(index);
    setModalOpen(true);
  };

  const handleCloseModal = async (completed) => {
    if (completed) {
      setModalOpen(false);
      setCertificateModalOpen(true);
    } else {
      try {
        const res = await axios.get(`/certifications/failed?empId=${auth.user.empId}&certificationId=${selectedCertification}`);
        setModalOpen(false);
        fetchData();
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    }
  };

  const handleCertificateUpload = () => {
    if (url === '') {
      alert('Please upload a file before submitting.');
      return;
    }
    setCertificateModalOpen(false);
    setFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    fetchData();
  };

  const handleFeedbackSubmit = async () => {
    try {
      const payload = {
        rating: feedbackData.rating,
        comment: feedbackData.comments,
        certificationId: selectedCertification,
        empName: auth?.user?.empName,
        empId: auth?.user?.empId
      };
      const res = await axios.post(
        `/certifications/completed?empId=${auth?.user?.empId}&certificationId=${selectedCertification}&url=${url}`,
        payload
      );

      setCertifications((prev) => {
        prev[index].status = 'Passed';
        return prev;
      });

      setFeedbackData({ rating: 0, comments: '' });
      setUrl('');
      setFeedbackOpen(false);
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const countByStatus = () => {
    return certifications.reduce((acc, certification) => {
      acc[certification?.status] = (acc[certification?.status] || 0) + 1;
      return acc;
    }, {});
  };

  const [chartData, setChartData] = useState(countByStatus());

  useEffect(() => {
    setChartData(countByStatus());
  }, [certifications]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return '#3498db';
      case 'Passed':
        return '#2ecc71';
      case 'Failed':
        return '#e74c3c';
      default:
        return '#000';
    }
  };

  const pieData = Object.keys(chartData).map((status) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: chartData[status],
    percentage: ((chartData[status] / certifications.length) * 100).toFixed(1) + '%'
  }));

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedCertifications = [...certifications].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'name') {
        return aValue?.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'attempts') {
        return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }
    return 0;
  });

  return (
    <div className="container">
      <div className="content-section" style={{ display: 'flex' }}>
        <div className="certifications-section" style={{ flex: '0 1 70%', marginRight: '20px', textAlign: 'center' }}>
          <h2 style={{ paddingBottom: '20px', fontSize: '22px' }}>Certifications Approved</h2>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <div style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
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
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                        <div
                          style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Certification Name
                          {sortConfig.key === 'name' ? (
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
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('attempts')}>
                        <div
                          style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Attempts
                          {sortConfig.key === 'attempts' ? (
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedCertifications.map((certification, index) => (
                      <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                        <TableCell style={{ textAlign: 'center' }}>{certification?.name}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          <Typography variant="body1" style={{ fontWeight: 'bold', color: getStatusColor(certification.status) }}>
                            {certification?.status?.charAt(0)?.toUpperCase() + certification?.status?.slice(1)}
                          </Typography>
                        </TableCell>
                        <TableCell style={{ textAlign: 'center' }}>{certification?.attempts}</TableCell>
                        <TableCell style={{ textAlign: 'center' }}>
                          {certification?.status === 'Ongoing' && (
                            <Button
                              variant="contained"
                              style={{ backgroundColor: '#3498db', color: 'white', marginRight: '8px' }}
                              onClick={() => handleSelfAssessmentClick(certification?.certificationId, index)}
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
            </div>
          </div>
        </div>
        <div className="pie-chart-section" style={{ flex: '0 1 30%', position: 'sticky', top: 20 }}>
          <Typography variant="h4" style={{ textAlign: 'center', marginTop: '25%', marginBottom: '-60px', fontSize: '18px' }}>
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
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={14}>
                      {`${Math.round(percent * 100)}%`}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.name === 'Ongoing' ? '#3498db' : entry.name === 'Failed' ? '#e74c3c' : '#2ecc71'}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Modal open={modalOpen}>
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
            Have you cleared the certification exam?
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

      {/* New Modal for Certificate Upload */}
      <Modal open={certificateModalOpen} onClose={() => setCertificateModalOpen(false)}>
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
            Upload Passing Certificate
          </Typography>
          <Typography variant="subtitle1" gutterBottom style={{ fontSize: '16px', textAlign: 'center' }}>
            Please upload your passing certificate for verification.
          </Typography>
          <UploadWidget setUrl={setUrl} setFilename={setFilename} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
            <Button variant="contained" color="primary" onClick={handleCertificateUpload}>
              Submit
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
            Feedback
          </Typography>
          <div style={{ marginBottom: '18px', textAlign: 'center' }}>
            <Typography variant="subtitle1" gutterBottom style={{ fontSize: '15px' }}>
              <b>Congratulations on passing the exam! </b>
              Please rate the relevance of the courses provided for this certification.
            </Typography>
            <div style={{ display: 'inline-block' }}>
              <Rating
                name="certification-rating"
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
    </div>
  );
}

export default CertificationsApproved;
