import React, { useState, useEffect } from 'react';
import 'chart.js/auto';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Popover,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DownloadIcon from '@mui/icons-material/Download';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../api/axios';

import './EmployeeReport.css';

const CertificationsReport = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQueryID, setSearchQueryID] = useState('');
  const [searchQueryName, setSearchQueryName] = useState('');
  const [downloadAnchorEl, setDownloadAnchorEl] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredCertifications, setFilteredCertifications] = useState([]);

  const navigate = useNavigate();
  const auth = useSelector((state) => state?.auth);

  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    if (!auth?.isAuthenticated) navigate('/login');

    const fetchData = async () => {
      try {
        const { data } = await axios.get('certifications/certificationReport');

        const temp = data?.map((item) => ({
          empid: item?.empId,
          name: item?.empName,
          certificationName: item?.certName,
          category: item?.domain,
          year: item?.completionDate?.map((date) => date.split('-')[2])
        }));

        setCertifications(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate]);

  const handleGenerateReport = (format) => {
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text('Certifications Report', 10, 10);
      const tableRows = [];
      filteredCertifications.forEach((certification) => {
        tableRows.push([
          certification.empid,
          certification.name,
          certification.certificationName,
          certification.category,
          certification.year
        ]);
      });
      doc.autoTable({
        head: [['EmpID', 'Name', 'Certifications', 'Category', 'Year']],
        body: tableRows,
        startY: 20
      });
      doc.save('certifications_report.pdf');
    } else if (format === 'xlsx') {
      const tableData1 = filteredCertifications?.flatMap((certification) => {
        return certification.certificationName.map((cert, index) => ({
          EmpID: certification.empid,
          Name: certification.name,
          Certification: cert,
          Category: certification.category[index],
          Year: certification.year[index]
        }));
      });

      const ws = XLSX.utils.json_to_sheet(tableData1, { header: Object.keys(tableData1[0]) });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Certifications Report');
      XLSX.writeFile(wb, 'certifications_report.xlsx');
    } else if (format === 'csv') {
      const csv = Papa.unparse(filteredCertifications);
      const csvContent = `data:text/csv;charset=utf-8,${csv}`;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'certifications_report.csv');
      document.body.appendChild(link);
      link.click();
    }
  };

  const years = ['All', ...new Set(certifications?.flatMap((certification) => certification.year))];
  const categories = ['All', ...new Set(certifications?.flatMap((certification) => certification.category))];

  useEffect(() => {
    filterCertifications();
  }, [selectedYear, selectedCategory, searchQueryID, searchQueryName, certifications]);

  const filterCertifications = () => {
    let filteredData = certifications;

    if (selectedYear && selectedYear !== 'All') {
      filteredData = filteredData.filter((certification) => certification.year.includes(selectedYear));
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filteredData = filteredData.filter((certification) => certification.category.includes(selectedCategory));
    }

    if (searchQueryID) {
      filteredData = filteredData.filter((certification) => certification.empid.toLowerCase().includes(searchQueryID.toLowerCase()));
    }

    if (searchQueryName) {
      filteredData = filteredData.filter((certification) => {
        return certification.certificationName.some(certName =>
          certName.toLowerCase().includes(searchQueryName.toLowerCase())
        );
      });
    }

    setFilteredCertifications(filteredData);
  };

  const certificationCounts = certifications
    ?.flatMap((certification) => certification.certificationName)
    .reduce((acc, certification) => {
      acc[certification] = (acc[certification] || 0) + 1;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(certificationCounts),
    datasets: [
      {
        label: 'Number of Employees',
        data: Object.values(certificationCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Employees'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Certifications'
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ textAlign: 'center' }}>
        <h2>Certifications Report</h2>
        <div className="employee-report-filters" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <TextField
            select
            label="Year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ marginRight: '10px' }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Autocomplete
            options={categories}
            value={selectedCategory}
            onChange={(event, newValue) => setSelectedCategory(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                style={{ marginRight: '10px' }}
                fullWidth
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  style: { paddingRight: '10px' }
                }}
              />
            )}
            clearOnEscape={false}
            clearIcon={null}
          />
          <TextField
            label="Search by ID"
            value={searchQueryID}
            onChange={(e) => setSearchQueryID(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Search  Certification"
            value={searchQueryName}
            onChange={(e) => setSearchQueryName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button
            variant="contained"
            endIcon={<DownloadIcon />}
            onClick={(event) => setDownloadAnchorEl(event.currentTarget)}
            style={{ marginRight: '10px' }}
          >
            Download
          </Button>
          <Button
            variant="contained"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            style={{ marginRight: '10px' }}
          >
            Chart
          </Button>
          <Popover
            open={Boolean(downloadAnchorEl)}
            anchorEl={downloadAnchorEl}
            onClose={() => setDownloadAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <List>
              <ListItem button onClick={() => handleGenerateReport('pdf')}>
                <ListItemText primary="PDF" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('xlsx')}>
                <ListItemText primary="Excel" />
              </ListItem>
              <ListItem button onClick={() => handleGenerateReport('csv')}>
                <ListItemText primary="CSV" />
              </ListItem>
            </List>
          </Popover>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flex: '1', width: '100%', overflow: 'hidden', alignItems: 'flex-start' }}>
            <div style={{ height: 'calc(100vh - 290px)', flex: '1 0 100%', overflowX: 'hidden', overflowY: 'auto' }}>
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
                  width: '100%',
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
                <Table aria-label="certifications report table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Employee ID
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Name
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Certification
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Category
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Year
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertifications?.map((certification, certIndex) => {
                      const matchingCertifications = certification.certificationName.reduce((acc, cert, index) => {
                        const certYear = certification.year[index];
                        if (
                          (!selectedYear || certYear === selectedYear) &&
                          (!selectedCategory || certification.category[index] === selectedCategory) &&
                          (!searchQueryName || cert.toLowerCase().includes(searchQueryName.toLowerCase())) 

                        ) {
                          acc.push({
                            cert,
                            category: certification.category[index],
                            year: certYear
                          });
                        }
                        return acc;
                      }, []);

                      let rows = [];
                      matchingCertifications.forEach((cert, index) => {
                        if (index === 0) {
                          rows.push(
                            <TableRow
                              key={`${certification.empid}-${cert.cert}`}
                              style={{ backgroundColor: certIndex % 2 === 0 ? '#f2f2f2' : 'white' }}
                            >
                              <TableCell align="center" rowSpan={matchingCertifications.length}>
                                {certification.empid}
                              </TableCell>
                              <TableCell align="center" rowSpan={matchingCertifications.length}>
                                {certification.name}
                              </TableCell>
                              <TableCell align="center">{cert.cert}</TableCell>
                              <TableCell align="center">{cert.category}</TableCell>
                              <TableCell align="center">{cert.year}</TableCell>
                            </TableRow>
                          );
                        } else {
                          rows.push(
                            <TableRow
                              key={`${certification.empid}-${cert.cert}`}
                              style={{ backgroundColor: certIndex % 2 === 0 ? '#f2f2f2' : 'white' }}
                            >
                              <TableCell align="center">{cert.cert}</TableCell>
                              <TableCell align="center">{cert.category}</TableCell>
                              <TableCell align="center">{cert.year}</TableCell>
                            </TableRow>
                          );
                        }
                      });

                      return matchingCertifications.length > 0 ? rows : null;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
          <div style={{ width: '80%', marginBottom: '20px', marginTop: '30px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default CertificationsReport;
