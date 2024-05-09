import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function createData(CourseID, CourseName) {
  return { CourseID, CourseName };
}

const approvedRows = [
  createData(123, 'Web Dev'),
  createData(124, 'App Dev'),
];

const pendingRows = [
  createData(125, 'UI/UX Design'),
  createData(126, 'Data Science'),
];

const Status = () => {
  const [pendingCourses, setPendingCourses] = useState(pendingRows);

  const handleCancel = (courseID) => {
    const updatedCourses = pendingCourses.filter(course => course.CourseID !== courseID);
    setPendingCourses(updatedCourses);
  };

  return (
    <div>
      <h2>Approved Courses</h2>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="approved courses table">
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvedRows.map((row) => (
              <TableRow key={row.CourseID}>
                <TableCell component="th" scope="row">
                  {row.CourseID}
                </TableCell>
                <TableCell>{row.CourseName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <h2>Pending Courses</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pending courses table">
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingCourses.map((row) => (
              <TableRow key={row.CourseID}>
                <TableCell component="th" scope="row">
                  {row.CourseID}
                </TableCell>
                <TableCell>{row.CourseName}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancel(row.CourseID)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Status;
