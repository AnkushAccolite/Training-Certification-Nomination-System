import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

function createData(SNo, CourseName, Duration, DateOfCompletion) {
  return { SNo, CourseName, Duration, DateOfCompletion };
}

const rows = [
  createData(1, 'Web Development', '2 months', '2024-04-15'),
  createData(2, 'App Development', '3 months', '2024-05-01'),
];

const CoursesCompleted = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div>
      <Typography variant="h3" gutterBottom style={{ marginBottom: '25px' }}>
        <span style={{ fontFamily: 'Arial', fontSize: '24px', marginRight: '10px' }}>Courses Completed</span>
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <CalendarTodayIcon />
        <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <span> - </span>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </LocalizationProvider>
        </Typography>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="completed courses table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Date of Completion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.filter((row) => {
              if (!startDate || !endDate) return true;
              const completionDate = dayjs(row.DateOfCompletion);
              return completionDate.isAfter(startDate, 'day') && completionDate.isBefore(endDate, 'day');
            }).map((row) => (
              <TableRow key={row.SNo}>
                <TableCell>{row.SNo}</TableCell>
                <TableCell>{row.CourseName}</TableCell>
                <TableCell>{row.Duration}</TableCell>
                <TableCell>{row.DateOfCompletion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default CoursesCompleted;
