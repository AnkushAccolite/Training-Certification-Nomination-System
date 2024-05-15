import React, { useState } from 'react';
import './RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isSelected = (courseId) => selectedRows.includes(courseId);

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
                <TableCell>Category</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course.courseId}
                  className={`course-row ${course.status !== 'Pending' ? 'greyed-out' : ''}`}
                >
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.courseDuration}</TableCell>
                  <TableCell>
                    <Button
                      className={`accept-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
                      disabled={courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected}
                      onClick={() => handleAcceptReject(course.courseId, 'accept')}
                      variant="outlined"
                      startIcon={<CheckCircleOutlineIcon />}
                    >
                      Accept
                    </Button>
                    <Button
                      className={`reject-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
                      disabled={courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected}
                      onClick={() => handleAcceptReject(course.courseId, 'reject')}
                      variant="outlined"
                      startIcon={<HighlightOffIcon />}
                    >
                      Reject
                    </Button>
                  </TableCell>
                  <TableCell>
                    {courseStatus.find((c) => c.id === course.courseId).accepted && <span className="status accepted">Accepted</span>}
                    {courseStatus.find((c) => c.id === course.courseId).rejected && <span className="status rejected">Rejected</span>}
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
