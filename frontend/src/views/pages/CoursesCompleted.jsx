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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function createData(SNo, CourseName, Duration, DateOfCompletion) {
  return { SNo, CourseName, Duration, DateOfCompletion };
}

const rows = [createData(1, 'Web Development', '2 months', '2024-04-15'), createData(2, 'App Development', '3 months', '2024-05-01')];

const CoursesCompleted = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (sortConfig.key === 'DateOfCompletion') {
        return (dayjs(aValue).isAfter(dayjs(bValue)) ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
      return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
    }
    return 0;
  });

  return (
    <div>
      <Typography variant="h3" gutterBottom style={{ marginBottom: '25px' }}>
        <span style={{ fontFamily: 'Arial', fontSize: '24px', marginRight: '10px' }}>Courses Completed</span>
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <CalendarTodayIcon />
        <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Start Date" value={startDate} onChange={handleStartDateChange} />
            <span> - </span>
            <DatePicker label="End Date" value={endDate} onChange={handleEndDateChange} />
          </LocalizationProvider>
        </Typography>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="completed courses table">
          <TableHead>
            <TableRow>
              <TableCell>
                S.No 
              </TableCell>
              <TableCell onClick={() => handleSort('CourseName')} style={{ cursor: 'pointer' }}>
                Course Name {<ArrowDropDownIcon style={{ fontSize: '130%' }} />}
              </TableCell>
              <TableCell onClick={() => handleSort('Duration')} style={{ cursor: 'pointer' }}>Duration {<ArrowDropDownIcon style={{ fontSize: '130%' }} />}</TableCell>
              <TableCell onClick={() => handleSort('DateOfCompletion')} style={{ cursor: 'pointer' }}>
                Date of Completion {<ArrowDropDownIcon style={{ fontSize: '130%' }}  />}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedRows
              .filter((row) => {
                if (!startDate && !endDate) return true;
                const completionDate = dayjs(row.DateOfCompletion);
                const afterStartDate = !startDate || completionDate.isAfter(startDate, 'day') || completionDate.isSame(startDate, 'day');
                const beforeEndDate = !endDate || completionDate.isBefore(endDate, 'day') || completionDate.isSame(endDate, 'day');
                return afterStartDate && beforeEndDate;
              })
              .map((row) => (
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
};

export default CoursesCompleted;
