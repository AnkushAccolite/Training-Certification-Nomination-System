import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';


function createData(SNo, CourseName, Duration, DateOfCompletion) {
  return { SNo, CourseName, Duration, DateOfCompletion };
}

const rows = [
  createData(1, 'Web Development', '2 months', '2024-04-15'),
  createData(2, 'App Development', '3 months', '2024-05-01'),
  createData(3, 'App Development', '3 months', '2024-03-01'),
  createData(4, 'App Development', '3 months', '2024-12-01'),
  createData(5, 'App Development', '3 months', '2024-12-01'),
  createData(6, 'App Development', '3 months', '2024-04-01'),
  createData(7, 'App Development', '3 months', '2024-01-01'),
  createData(8, 'App Development', '3 months', '2024-02-01'),
  createData(9, 'App Development', '3 months', '2024-05-01'),
  createData(10, 'App Development', '3 months', '2024-06-01'),
  createData(11, 'App Development', '3 months', '2024-07-01'),
  createData(12, 'App Development', '3 months', '2024-08-01'),
  createData(13, 'App Development', '3 months', '2024-09-01'),
  createData(14, 'App Development', '3 months', '2024-10-01'),
];

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

  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (!(auth?.isAuthenticated)) navigate("/login");
  }, [auth, navigate]);

  const getPieChartData = () => {
    const data = rows.reduce((acc, row) => {
      const month = dayjs(row.DateOfCompletion).format('MMM YYYY');
      const existingMonth = acc.find(item => item.name === month);
      if (existingMonth) {
        existingMonth.value += 1;
      } else {
        acc.push({ name: month, value: 1 });
      }
      return acc;
    }, []);
    return data;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#c32148', '#777777', '#842593', '#f88379', '#AF7AC5', '#9FE2BF', '#B3B6B7', '#E727B0'];

  const tableContainerStyles = {
    '&::-webkit-scrollbar': {
      width: '5px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F2F4F4',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#B3B6B7',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#888888',
    },
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 75%', overflowY: 'auto', height: '100vh' }}>
        <Typography variant="h3" gutterBottom style={{ marginBottom: '25px' }}>
          <span style={{ fontFamily: 'Arial', fontSize: '24px', marginRight: '10px' }}>Courses Completed</span>
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <CalendarTodayIcon />
          <Typography variant="subtitle1" style={{ marginLeft: '10px' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker label="Start Date" value={startDate} onChange={handleStartDateChange} />
              <span style={{ paddingLeft: '10px', paddingRight: '10px' }}> - </span>
              <DatePicker label="End Date" value={endDate} onChange={handleEndDateChange} />
            </LocalizationProvider>
          </Typography>
        </div>
        <TableContainer component={Paper} sx={tableContainerStyles}>
          <Table sx={{ minWidth: 850 }} aria-label="completed courses table">
            <TableHead>
              <TableRow>
                <TableCell style={{ alignContent:'center'}}>S.No</TableCell>
                <TableCell onClick={() => handleSort('CourseName')} style={{ alignContent:'center',cursor: 'pointer' }}>
                  Course Name <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                </TableCell>
                <TableCell onClick={() => handleSort('Duration')} style={{ alignContent:'center',cursor: 'pointer' }}>
                  Duration <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                </TableCell>
                <TableCell onClick={() => handleSort('DateOfCompletion')} style={{ alignContent:'center',cursor: 'pointer' }}>
                  Date of Completion <ArrowDropDownIcon style={{ fontSize: '130%' }} />
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
                    <TableCell style={{ alignContent:'center'}}>{row.SNo}</TableCell>
                    <TableCell style={{ alignContent:'center'}}>{row.CourseName}</TableCell>
                    <TableCell style={{ alignContent:'center'}}>{row.Duration}</TableCell>
                    <TableCell style={{ alignContent:'center'}}>{row.DateOfCompletion}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div style={{ flex: '0 0 25%', position: 'sticky', top: 20 }}>
        <Typography variant="h4" style={{ textAlign: 'center', marginTop: '50%' }}>
          Courses Completed Per Month
        </Typography>
        <ResponsiveContainer width="100%" height="70%">
          <PieChart>
            <Pie
              data={getPieChartData()}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="35%"
              outerRadius={105}
              fill="#8884d8"
              label
            >
              {getPieChartData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CoursesCompleted;
