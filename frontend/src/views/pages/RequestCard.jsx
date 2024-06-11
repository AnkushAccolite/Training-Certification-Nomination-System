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
      <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center', paddingLeft:'6px', paddingTop:'3px'}}>
        {employeeName} {collapsed ? <ArrowDropDownIcon sx={{ fontSize: '1.5em', verticalAlign: 'middle' }}/> : <ArrowDropUpIcon />}
      </h3>
      {!collapsed && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{backgroundColor:'#f2f2f2'}}>
              <TableRow>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Course Name</TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Duration</TableCell>
                <TableCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nominations.map((course) => (
                <TableRow key={course?.courseId} className={`course-row ${course?.approvalStatus !== 'PENDING' ? 'greyed-out' : ''}`}>
                  <TableCell style={{ textAlign: 'center'}}>{course?.courseName}</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>{course?.domain}</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>{course?.duration}</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>
                    {course?.approvalStatus === 'PENDING' && (
                      <>
                        <Button
                          className={`accept-button ${isSelected(course?.courseId) ? 'highlighted' : ''}`}
                          onClick={() => {
                            onAccept(course?.courseId);
                          }}
                          variant="outlined"
                          startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '1em', verticalAlign: 'middle' }}/>}
                          style={{paddingRight:'15px',paddingLeft:'15px'}}
                        >
                          Accept
                        </Button>
                        <Button
                          className={`reject-button ${isSelected(course?.courseId) ? 'highlighted' : ''}`}
                          onClick={() => onReject(course?.courseId)}
                          variant="outlined"
                          startIcon={<HighlightOffIcon sx={{ fontSize: '1em', verticalAlign: 'middle' }} />}
                          style={{paddingRight:'15px',paddingLeft:'15px'}}
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
