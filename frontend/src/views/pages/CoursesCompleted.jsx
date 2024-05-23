import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import './CoursesCompleted.css';

import getNominationCourses from 'utils/getNominationCourses';
import getAllCourses from 'utils/getAllCourses';

const CoursesCompleted = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeIndex, setActiveIndex] = useState(null);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');

    const fetchData = async () => {
      try {
        const nominationCourses = await getNominationCourses(auth?.user?.empId);
        const completedCourses = nominationCourses?.completedCourses;

        const allCourses = await getAllCourses();

        const temp = allCourses
          .filter((course) => completedCourses?.some((completed) => completed?.courseId === course?.courseId))
          .map((course, index) => {
            const completedCourse = completedCourses?.find((completed) => completed?.courseId === course?.courseId);
            return {
              SNo: index + 1,
              CourseName: course?.courseName,
              Duration: `${course?.duration}`,
              DateOfCompletion: completedCourse?.month
            };
          });

        setRows(temp);
        console.log(completedCourses);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate]);

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
      } else if (sortConfig.key === 'SNo') {
        return (aValue - bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
      return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
    }
    return 0;
  });

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');
  }, [auth, navigate]);

  const getPieChartData = () => {
    const data = rows.reduce((acc, row) => {
      const month = row.DateOfCompletion;
      const existingMonth = acc.find((item) => item.name === month);
      if (existingMonth) {
        existingMonth.value += 1;
      } else {
        acc.push({ name: month, value: 1 });
      }
      return acc;
    }, []);
    return data;
  };

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#c32148',
    '#777777',
    '#842593',
    '#f88379',
    '#AF7AC5',
    '#9FE2BF',
    '#B3B6B7',
    '#E727B0'
  ];

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Courses Completed</h2>
      <div className="courses-completed-container" style={{ overflowX: 'hidden' }}>
        <div className="left-panel" style={{ overflowX: 'hidden' }}>
          <div className="course-filters">
            <FormControl className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker views={['year', 'month']} label="Start Month" value={startDate} onChange={handleStartDateChange} />
              </LocalizationProvider>
            </FormControl>
            <span className="date-separator"> - </span>
            <FormControl className="date-picker">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker views={['year', 'month']} label="End Month" value={endDate} onChange={handleEndDateChange} />
              </LocalizationProvider>
            </FormControl>
          </div>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <div style={{ height: 'calc(100vh - 300px)', overflowY: 'auto', overflowX: 'hidden' }}>
              <TableContainer
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  paddingRight: '8px',
                  marginBottom: '-16px',
                  overflowX: 'hidden'
                }}
                component={Paper}
                sx={{
                  maxHeight: '100%',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    borderRadius: '3px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#FFFFFF'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#eee6ff',
                    borderRadius: '3px'
                  }
                }}
              >
<Table aria-label="completed courses table">
  <TableHead>
    <TableRow>
      <TableCell
        onClick={() => handleSort('SNo')}
        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        S.No <ArrowDropDownIcon style={{ fontSize: '130%' }} />
      </TableCell>
      <TableCell
        onClick={() => handleSort('CourseName')}
        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Course Name <ArrowDropDownIcon style={{ fontSize: '130%' }} />
      </TableCell>
      <TableCell
        onClick={() => handleSort('Duration')}
        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Duration (hrs) <ArrowDropDownIcon style={{ fontSize: '130%' }} />
      </TableCell>
      <TableCell
        onClick={() => handleSort('DateOfCompletion')}
        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Completion Month <ArrowDropDownIcon style={{ fontSize: '130%' }} />
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {sortedRows
      .filter((row) => {
        if (!startDate && !endDate) return true;
        const completionDate = dayjs(row.DateOfCompletion);
        const afterStartDate =
          !startDate || completionDate.isAfter(startDate, 'month') || completionDate.isSame(startDate, 'month');
        const beforeEndDate =
          !endDate || completionDate.isBefore(endDate, 'month') || completionDate.isSame(endDate, 'month');
        return afterStartDate && beforeEndDate;
      })
      .map((row, index) => (
        <TableRow key={row.SNo} style={{ backgroundColor: index % 2 === 0 ? '#F2F2F2' : '#FFFFFF' }}>
          <TableCell style={{ textAlign: 'center' }}>{row.SNo}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{row.CourseName}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{row.Duration}</TableCell>
          <TableCell style={{ textAlign: 'center' }}>{row.DateOfCompletion}</TableCell>
        </TableRow>
      ))}
  </TableBody>
</Table>

              </TableContainer>
            </div>
          </div>
        </div>
        <div className="right-panel" style={{ overflowX: 'hidden' }}>
          <Typography variant="h4" style={{ textAlign: 'center', marginTop: '50%', marginBottom: '-30px' }}>
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
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.68;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  const percentage = Math.round(percent * 100);
                  const spaceAvailable = innerRadius < 20 || outerRadius - innerRadius > 30;
                  return spaceAvailable ? (
                    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central">
                      {`${percentage}%`}
                    </text>
                  ) : null;
                }}
                onMouseEnter={(e, entry) => setActiveIndex(entry.index)}
                onMouseLeave={() => setActiveIndex(null)}
                series={[
                  {
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' }
                  }
                ]}
              >
                {getPieChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={activeIndex === index ? 1 : 0.7} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CoursesCompleted;
