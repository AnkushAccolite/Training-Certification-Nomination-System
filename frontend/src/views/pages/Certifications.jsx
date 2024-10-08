import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
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
import './Certifications.css';
import axios from '../../api/axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import toast from 'react-hot-toast';
import Pagination from '@mui/material/Pagination';

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
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [selectedCertificationToDelete, setSelectedCertificationToDelete] = useState(null);

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  const empId = useSelector((state) => state?.auth?.user?.empId);

  const getStatus = (pendingCertifications, certifications, certificationId) => {
    if (pendingCertifications.includes(certificationId)) {
      return 'Pending for Approval';
    }

    const certificationEntries = certifications.filter((cert) => cert.certificationId === certificationId);

    if (certificationEntries.length === 0) {
      return 'Not Opted';
    }

    const latestAttempt = certificationEntries.reduce(
      (latest, current) => (current.attempt > latest.attempt ? current : latest),
      certificationEntries[0]
    );

    switch (latestAttempt.status) {
      case 'inProgress':
        return 'Approved';
      case 'completed':
        return 'Completed';
      default:
        return 'Not Opted';
    }
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
      toast.error('Error fetching certifications');
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
      const tc = await axios.post(`/certifications/agreeTC?empId=${empId}`, selectedCourseIds);
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
      const res = await axios.get(
        `/certifications/cancel?loggedInUser=${auth?.user?.empId}&empId=${empId}&certificationId=${certificationId}`
      );
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

  const handleDeleteClick = (certification) => {
    setSelectedCertificationToDelete(certification);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.patch(`/certifications/${selectedCertificationToDelete.certificationId}/${empId}`);
      toast.success(`Certification "${selectedCertificationToDelete.name}" deleted successfully.`);
      handleCloseConfirmationDialog();
      fetchData();
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Error deleting certification');
    }
  };

  const handleCloseConfirmationDialog = () => {
    setSelectedCertificationToDelete(null);
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedCourses.filter(filterCourses).slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '-5px' }}>Available Certifications</h2>
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

        {auth?.isAuthenticated && auth?.user?.role === 'ADMIN' ? (
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
        ) : (
          <></>
        )}

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
        <div style={{ flex: '1', overflow: 'hidden' }}>
          <div style={{ height: 'calc(110vh - 350px)', overflowY: 'auto' }}>
            {sortedCourses.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  height: '70%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                No Certifications Available
              </div>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
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
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRows.map((row, index) => (
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
                          {auth?.isAuthenticated && auth?.user?.role === 'ADMIN' && (
                            <Button variant="outlined" onClick={() => handleDeleteClick(row)} style={{ marginLeft: '8px' }}>
                              Delete
                            </Button>
                          )}
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
            )}
          </div>
        </div>
        <Pagination
          count={Math.ceil(sortedCourses.filter(filterCourses).length / rowsPerPage)}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onChangeRowsPerPage={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(1);
          }}
        />

        <Dialog
          open={showDetails}
          onClose={handleCloseDetails}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: '0.7%',
              justifyContent: 'space-between'
            }
          }}
        >
          <DialogTitle variant="h3" style={{ fontSize: '19px', textAlign: 'center', paddingBottom: '0.6% ' }}>
            Certificate Details
          </DialogTitle>
          <DialogContent sx={{ flex: 1, overflowY: 'auto', paddingBottom: '0% ' }}>
            {selectedCourse && (
              <div>
                <h3 style={{ textAlign: 'center', paddingBottom: '0% ' }}>{selectedCourse?.name}</h3>
                <p style={{ textAlign: 'center' }}>{selectedCourse.description}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails} variant="outlined">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Reimbursement Policy */}
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
                marginRight: '10px'
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
                marginRight: '10px'
              }}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reimbursement Policy*/}
        <Dialog open={showPDF} onClose={handleClosePDF} maxWidth="lg" fullWidth>
          <DialogTitle>Certificate Reimbursement Policy</DialogTitle>
          <DialogContent>
            <embed src="/Certification Reimbursement Policy.pdf" type="application/pdf" width="100%" height="500px" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePDF}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for delete */}
        <Dialog open={!!selectedCertificationToDelete} onClose={handleCloseConfirmationDialog}>
          <DialogTitle style={{ fontSize: '15px', textAlign: 'center', padding: '40px' }}>
            <span style={{ color: 'black' }}>{`Are you sure you want to delete the certification: `}</span>
            <br />
            <span style={{ color: 'black', fontSize: '15px' }}>
              <b>{selectedCertificationToDelete?.name}</b>?
            </span>
          </DialogTitle>
          <DialogActions style={{ justifyContent: 'center', marginTop: '-30px' }}>
            <Button onClick={handleCloseConfirmationDialog} style={{ backgroundColor: '#2196f3', color: 'white', marginBottom: '20px' }}>
              No
            </Button>
            <Button onClick={handleConfirmDelete} style={{ backgroundColor: '#db3312', color: 'white', marginBottom: '20px' }}>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Certifications;
