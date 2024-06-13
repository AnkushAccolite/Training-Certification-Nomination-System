import React, { useEffect, useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import './CoursesCompleted.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import getEmployee from '../../utils/getEmployee';
import getAllCertifications from '../../utils/getAllCertifications';

dayjs.extend(customParseFormat);

const CertificationsCompleted = () => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activeIndex, setActiveIndex] = useState(null);
  const [rows, setRows] = useState([]);

  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');

    const fetchData = async () => {
      try {
        const allCertifications = await getAllCertifications();

        const employee = await getEmployee(auth?.user?.email);
        const completedCertifications = employee?.certifications?.filter((cert) => cert.status === 'completed');

        const temp = completedCertifications?.map((completedCertificate, index) => {
          const certificateDetails = allCertifications?.find((cert) => cert?.certificationId === completedCertificate?.certificationId);
          return {
            CertificationName: certificateDetails?.name,
            Duration: certificateDetails?.duration,
            DateOfCompletion: completedCertificate?.completionDate
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
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'CertificationName') {
        return aValue?.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
      }
      else if (sortConfig.key === 'DateOfCompletion') {
        return (dayjs(aValue, 'DD-MM-YYYY').isAfter(dayjs(bValue, 'DD-MM-YYYY')) ? 1 : -1) * (sortConfig.direction === 'asc' ? 1 : -1);
      } 
      return (parseInt(aValue) - parseInt(bValue)) * (sortConfig.direction === 'asc' ? 1 : -1);
    }

    return 0;
  });

  const getPieChartData = () => {
    const data = rows.reduce((acc, row) => {
      const month = dayjs(row.DateOfCompletion, 'DD-MM-YYYY').format('MMM YYYY');
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
      <div className="courses-completed-container">
        <div className="left-panel">
          <h2 style={{ paddingBottom: '20px', textAlign: 'center' }}>Certifications Completed</h2>
          <div style={{ flex: '1', overflow: 'hidden' }}>
            <div style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}>
              <TableContainer
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  paddingRight: '8px',
                  marginBottom: '-16px'
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
                <Table aria-label="completed certifications table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('CertificationName')}>
                        <div
                          style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Certification Name
                          {sortConfig.key === 'name' ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                            ) : (
                              <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                            )
                          ) : (
                            <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('Duration')}>
                        <div
                          style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Duration (hrs)
                          {sortConfig.key === 'Duration' ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                            ) : (
                              <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                            )
                          ) : (
                            <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell style={{ cursor: 'pointer' }} onClick={() => handleSort('DateOfCompletion')}>
                        <div
                          style={{ display: 'flex', fontSize: '16px', fontWeight: 'bold', alignItems: 'center', justifyContent: 'center' }}
                        >
                          Completion Date
                          {sortConfig.key === 'DateOfCompletion' ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                            ) : (
                              <ArrowDropUpIcon style={{ fontSize: '130%' }} />
                            )
                          ) : (
                            <ArrowDropDownIcon style={{ fontSize: '130%' }} />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedRows.map((row, index) => (
                      <TableRow style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
                        <TableCell style={{ textAlign: 'center' }}>{row.CertificationName}</TableCell>
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
            Monthly Completion Status
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

export default CertificationsCompleted;
