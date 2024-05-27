import React, { useEffect, useState } from 'react';
import '../../assets/css/RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const RequestCard = ({ employeeName, nominations = [], onAccept, onReject }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isSelected = (courseId) => selectedRows.includes(courseId);

  useEffect(() => {
    console.log(nominations);
  }, []);

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
                <TableCell>Course Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nominations.map((course) => (
                <TableRow key={course?.courseId} className={`course-row ${course?.approvalStatus !== 'PENDING' ? 'greyed-out' : ''}`}>
                  <TableCell>{course?.courseName}</TableCell>
                  <TableCell>{course?.domain}</TableCell>
                  <TableCell>{course?.duration}</TableCell>
                  <TableCell>
                    {course?.approvalStatus === 'PENDING' && (
                      <>
                        <Button
                          className={`accept-button ${isSelected(course?.courseId) ? 'highlighted' : ''}`}
                          onClick={() => {
                            onAccept(course?.courseId);
                          }}
                          variant="outlined"
                          startIcon={<CheckCircleOutlineIcon />}
                        >
                          Accept
                        </Button>
                        <Button
                          className={`reject-button ${isSelected(course?.courseId) ? 'highlighted' : ''}`}
                          onClick={() => onReject(course?.courseId)}
                          variant="outlined"
                          startIcon={<HighlightOffIcon />}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {course?.approvalStatus !== 'PENDING' && (
                      <span className={`status ${course?.approvalStatus.toLowerCase()}`}>{course?.approvalStatus}</span>
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

export default RequestCard;
