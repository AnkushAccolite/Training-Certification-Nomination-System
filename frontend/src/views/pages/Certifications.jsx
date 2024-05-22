import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Import the PDF icon
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import QueueIcon from '@mui/icons-material/Queue';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import './Courses.css';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ['All', 'Technical', 'Domain', 'Power', 'Process'];
const statuses = ['All', 'Not Opted', 'Pending for Approval', 'Approved', 'Completed'];

function Certifications() {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPDF, setShowPDF] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  const empId = useSelector((state) => state?.auth?.user?.empId);

  const getStatus = (pendingCertifications, certifications, certificationId) => {
    if (pendingCertifications.includes(certificationId)) {
      return 'Pending for Approval';
    }
    const certificationEntries = certifications.filter((cert) => cert.certificationId === certificationId);
    if (certificationEntries.length > 0) {
      const latestAttempt = certificationEntries.reduce(
        (latest, current) => (current.attempt > latest.attempt ? current : latest),
        certificationEntries[0]
      );

      return latestAttempt.status === 'inProgress' ? 'Approved' : latestAttempt.status === 'completed' ? 'Completed' : 'Not Opted';
    }
    return 'Not Opted';
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get('/certifications');

      const res = await axios.get(`/certifications/employee/${empId}`);

      const pendingCertifications = res.data.pendingCertifications;
      const certifications = res.data.certifications;

      const temp = data?.map((cert) => ({ ...cert, status: getStatus(pendingCertifications, certifications, cert?.certificationId) }));

      setCourses(temp);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching courses');
    }
  };
  useEffect(() => {
    fetchData();
  }, [empId]);

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  const handleClick = () => {
    navigate('/Certifications/add-certifications');
  };

  const handleCheckboxChange = (event, courseId) => {
    const { checked } = event.target;
    setSelectedCourseIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, courseId];
      } else {
        return prevSelected.filter((id) => id !== courseId);
      }
    });
  };

  const handleDomainChange = (event) => {
    setSelectedDomain(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const openConfirmationDialog = () => {
    if (selectedCourseIds.length === 0) {
      toast.error('Please select at least one certification for nomination.');
    } else {
      setShowConfirmation(true);
    }
  };

  const closeConfirmationDialog = () => {
    setShowConfirmation(false);
  };

  const nominateCertifications = async () => {
    try {
      const res = await axios.post(`/certifications/nominateCertification?empId=${empId}`, selectedCourseIds);
      setSelectedCourseIds([]);
      closeConfirmationDialog();
      toast.success('Certifications nominated');
      fetchData();
      // navigate(0);
    } catch (error) {
      console.log('error');
      toast.error('Something went wrong');
    }
  };

  const cancelNomination = async (certificationId) => {
    try {
      const res = await axios.get(`/certifications/cancel?empId=${empId}&certificationId=${certificationId}`);
      toast.success('Nomination cancelled successfully');
      fetchData();
      // navigate(0);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handlePDFClick = () => {
    setShowPDF(true);
  };

  const handleClosePDF = () => {
    setShowPDF(false);
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
      if (sortConfig.key === 'name') {
        return aValue?.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
    }

    return 0;
  });
  const filterCourses = (course) => {
    if (selectedDomain === 'All' && selectedStatus === 'All') {
      return true;
    } else if (selectedDomain === 'All') {
      return course?.status === selectedStatus;
    } else if (selectedStatus === 'All') {
      return course?.domain === selectedDomain;
    } else {
      return course?.domain === selectedDomain && course?.status === selectedStatus;
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Available Certifications</h2>
      <div className="filters">
        <FormControl style={{ marginRight: '10px', marginLeft: '10px', marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedDomain}
            onChange={handleDomainChange}
            renderValue={(selected) => {
              return 'Domain';
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="separator"></div>
        <FormControl style={{ marginRight: '10px', marginTop: '10px' }}>
          <Select
            displayEmpty
            value={selectedStatus}
            onChange={handleStatusChange}
            renderValue={(selected) => {
              return 'Status';
            }}
            inputProps={{ 'aria-label': 'Without label' }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          className="nominateBtn"
          variant="outlined"
          startIcon={<LocalLibraryIcon />}
          onClick={openConfirmationDialog}
          style={{ marginLeft: 'auto', marginRight: '-5px' }}
        >
          Nominate
        </Button>
        <Button
          style={{
            marginRight: '-5px',
            color: '#3498db',
            border: 'none',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '1px solid #3498db';
            e.currentTarget.style.backgroundColor = '#eaf5fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = 'none';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          className="addCertification"
          variant="outlined"
          startIcon={<QueueIcon />}
          onClick={handleClick}
        >
          Add Certification
        </Button>

        <Button
          style={{
            marginRight: '10px',
            color: '#3498db',
            border: 'none',
            backgroundColor: 'transparent',
            transition: 'all 0.5s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.border = '1px solid #3498db';
            e.currentTarget.style.backgroundColor = '#eaf5fe';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.border = 'none';
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transition = 'border 0.5s ease-in-out';
          }}
          className="reimbursementBtn"
          startIcon={<PictureAsPdfIcon />}
          onClick={handlePDFClick}
        >
          Reimbursement Policy
        </Button>
      </div>

      <div style={{ paddingTop: '2%', marginTop: '-20px' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell
                  onClick={() => handleSort('name')}
                  style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                >
                  Certification Name
                  <ArrowDropDownIcon style={{ fontSize: '80%' }} />
                </TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {sortedCourses.filter(filterCourses).map((row, index) => ( */}
              {sortedCourses.filter(filterCourses).map((row, index) => (
                <TableRow
                  key={row?.certificationId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCourseIds.includes(row?.certificationId)}
                      onChange={(e) => handleCheckboxChange(e, row?.certificationId)}
                      disabled={row?.status !== 'Not Opted'}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row?.name}</TableCell>
                  <TableCell style={{ textAlign: 'center' }}>{row?.domain}</TableCell>
                  <TableCell
                    style={{
                      color:
                        row?.status === 'Pending for Approval'
                          ? 'red'
                          : row?.status === 'Approved'
                            ? 'green'
                            : row?.status === 'Completed'
                              ? 'blue'
                              : 'inherit',
                      textAlign: 'center'
                    }}
                  >
                    {row?.status}
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Button variant="contained" onClick={() => handleViewDetails(row)}>
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => cancelNomination(row?.certificationId)}
                      disabled={row?.status !== 'Pending for Approval'}
                      style={{ marginLeft: '8px' }}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={showDetails} onClose={handleCloseDetails}>
          <DialogTitle style={{ fontSize: '17px', textAlign: 'center' }}>Course Details</DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <div>
                <h3 style={{ fontSize: '17px', textAlign: 'center' }}>{selectedCourse?.name}</h3>
                <p>{selectedCourse.description}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onClose={closeConfirmationDialog}>
          <DialogTitle className="confirmation-title" style={{ fontSize: '20px', textAlign: 'center' }}>
            <b>Confirmation</b>
          </DialogTitle>
          <DialogContent className="confirmation-content" style={{ textAlign: 'center' }}>
            By clicking on Nominate, you are agreeing to the certification reimbursement policies.
            <br /> Do you still want to proceed?
          </DialogContent>
          <DialogActions className="confirmation-actions">
            <Button
              onClick={nominateCertifications}
              className="confirmation-button-yes"
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                marginRight: '20px'
              }}
            >
              Yes
            </Button>
            <Button
              onClick={closeConfirmationDialog}
              className="confirmation-button-no"
              style={{
                backgroundColor: '#f44336',
                color: 'white',
                marginRight: '210px'
              }}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showPDF} onClose={handleClosePDF} maxWidth="lg" fullWidth>
          <DialogTitle>Certificate Reimbursement Policy</DialogTitle>
          <DialogContent>
            <embed src="../../../public/Certification Reimbursement Policy.pdf" type="application/pdf" width="100%" height="500px" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePDF}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Certifications;
