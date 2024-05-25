import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import './CoursesCompleted.css';
import getAllCourses from 'utils/getAllCourses';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import getNominationCourses from 'utils/getNominationCourses';

const CoursesCompleted = () => {
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
              CourseName: course?.courseName || '',
              Duration: `${course?.duration}` || '',
              DateOfCompletion: completedCourse?.month || ''
            };
          });

        setRows(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';
      if (sortConfig.key === 'DateOfCompletion') {
        return (dayjs(aValue).isAfter(dayjs(bValue)) ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
      } else if (sortConfig.key === 'SNo') {
        return (aValue - bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
      return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
    }
    return 0;
  });

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

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ArrowDropDownIcon style={{ fontSize: '130%' }} /> : <ArrowDropUpIcon style={{ fontSize: '130%' }} />;
    }
    return <ArrowDropDownIcon style={{ fontSize: '130%' }} />;
  };

  return (
    <div>
      <div className="courses-completed-container" style={{ overflowX: 'hidden' }}>
        <div className="left-panel" style={{ overflowX: 'hidden' }}>
          <h2 style={{ paddingBottom: '20px', textAlign: 'center' }}>Courses Completed</h2>
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
                        onClick={() => handleSort('CourseName')}
                        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Course Name {renderSortIcon('CourseName')}
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort('Duration')}
                        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Duration (hrs) {renderSortIcon('Duration')}
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort('DateOfCompletion')}
                        style={{ textAlign: 'center', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Completion Month {renderSortIcon('DateOfCompletion')}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRows.map((row, index) => (
                      <TableRow key={index} style={{ backgroundColor: index % 2 === 0 ? '#F2F2F2' : '#FFFFFF' }}>
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
        <div className="right-panel">
          <Typography variant="h4" style={{ textAlign: 'center', marginTop: '25%', marginBottom: '-20px', fontSize: '18px' }}>
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