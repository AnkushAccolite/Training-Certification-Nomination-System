import React, { useEffect, useState } from 'react';
import '../../assets/css/RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const CertificationCard = ({ employeeName, certifications = [], onAccept, onReject }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [certificationStatus, setCertificationStatus] = useState({});

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // Initialize certification status map with 'Pending' status for each certification
    const initialStatusMap = {};
    certifications.forEach(certification => {
      initialStatusMap[certification.certificationId] = certification.status || 'Pending';
    });
    setCertificationStatus(initialStatusMap);
  }, [certifications]);

  const handleAccept = (certificationId) => {
    setCertificationStatus(prevStatusMap => ({
      ...prevStatusMap,
      [certificationId]: 'Accepted'
    }));
    onAccept(certificationId);
  };

  const handleReject = (certificationId) => {
    setCertificationStatus(prevStatusMap => ({
      ...prevStatusMap,
      [certificationId]: 'Rejected'
    }));
    onReject(certificationId);
  };

  return (
    <div className="request-card">
      <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center' }}>
        {employeeName} {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </h3>
      {!collapsed && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Certification Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certifications.map((certification) => (
                <TableRow
                  key={certification.certificationId}
                  className={certificationStatus[certification.certificationId] !== 'Pending' ? 'greyed-out' : ''}
                >
                  <TableCell>{certification.certificationName}</TableCell>
                  <TableCell>{certification.category}</TableCell>
                  <TableCell>{certification.price}</TableCell>
                  <TableCell>
                    {certificationStatus[certification.certificationId] === 'Pending' && (
                      <>
                        <Button
                          className="accept-button"
                          onClick={() => handleAccept(certification.certificationId)}
                          variant="outlined"
                          startIcon={<CheckCircleOutlineIcon />}
                        >
                          Accept
                        </Button>
                        <Button
                          className="reject-button"
                          onClick={() => handleReject(certification.certificationId)}
                          variant="outlined"
                          startIcon={<HighlightOffIcon />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {certificationStatus[certification.certificationId] !== 'Pending' && (
                     <span className={`status ${certificationStatus[certification.certificationId]?.toLowerCase()}`}>

                        {certificationStatus[certification.certificationId]}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CertificationCard;
