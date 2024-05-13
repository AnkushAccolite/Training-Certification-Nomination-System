import * as React from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const names = ['All', 'Technical', 'Domain', 'Power'];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}

function createData(index, category, duration, description) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = [2022, 2023, 2024, 2025];

  let month, year;
  switch (index % 4) {
    case 0:
      month = 'May';
      year = 2024;
      break;
    case 1:
      month = 'April';
      year = 2024;
      break;
    case 2:
      month = 'January';
      year = 2025;
      break;
    case 3:
      month = 'December';
      year = 2024;
      break;
    default:
      month = 'January';
      year = 2024;
      break;
  }

  return { id: index, name: `Course ${index}`, category, duration, month, year, status: 'Not Opted', statusColor: 'black', description };
}

const initialRows = [
  createData(1, 'Technical', 4),
  createData(2, 'Technical', 8),
  createData(3, 'Domain', 3),
  createData(4, 'Technical', 5),
  createData(5, 'Power', 2),
  createData(6, 'Power', 1.5),
  createData(7, 'Domain', 4),
  createData(8, 'Technical', 2),
  createData(9, 'Domains', 2),
  createData(10, 'Technical', 8),
  createData(11, 'Domain', 3),
  createData(12, 'Technical', 2),
  createData(13, 'Technical', 2.5),
  createData(14, 'Technical', 2),
  createData(15, 'Technical', 1),
  createData(16, 'Power', 1.5),
  createData(17, 'Power', 1),
  createData(18, 'Technical', 6),
];

function Courses() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState('All');
  const [selectedCourseIds, setSelectedCourseIds] = React.useState([]);
  const [rows, setRows] = React.useState(initialRows);
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState('All');
  const [selectedMonth, setSelectedMonth] = React.useState('All');

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleCheckboxChange = (event, courseId) => {
    const { checked } = event.target;
    setSelectedCourseIds((prevSelected) => {
      if (checked) {
        return [...prevSelected, courseId];
      } else {
        return prevSelected.filter((id) => id !== courseId);
      }
    });
  };

  const nominateCourses = () => {
    const updatedRows = rows.map((row) => {
      if (selectedCourseIds.includes(row.id)) {
        return { ...row, status: 'Pending for Approval', statusColor: 'red' };
      }
      return row;
    });
    setRows(updatedRows);
    setSelectedCourseIds([]);
  };

  const cancelNomination = (courseId) => {
    const updatedRows = rows.map((row) => {
      if (row.id === courseId) {
        return { ...row, status: 'Not Opted', statusColor: 'black' };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setPersonName(event.target.value);
  };

  const filteredRows = rows.filter(row => {
    if (selectedYear !== 'All' && selectedMonth !== 'All') {
      return row.year === parseInt(selectedYear) && row.month === selectedMonth && (personName === 'All' || row.category === personName);
    } else if (selectedYear !== 'All') {
      return row.year === parseInt(selectedYear) && (personName === 'All' || row.category === personName);
    } else if (selectedMonth !== 'All') {
      return row.month === selectedMonth && (personName === 'All' || row.category === personName);
    } else {
      return personName === 'All' || row.category === personName;
    }
  });

  return (
    <div>
  <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
  <div style={{ marginRight: '20px' }}>
    <label htmlFor="demo-year-select">Filter By Year:</label>
    <FormControl sx={{ m: 1, width: 100 }}>
      <Select
        labelId="demo-year-label"
        id="demo-year-select"
        value={selectedYear}
        onChange={handleYearChange}
      >
        <MenuItem value="All">All</MenuItem>
        {[2022, 2023, 2024, 2025].map((year) => (
          <MenuItem key={year} value={year}>{year}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
  <div style={{ marginRight: '20px' }}>
    <label htmlFor="demo-month-select">Filter By Month:</label>
    <FormControl sx={{ m: 1, width: 100 }}>
      <Select
        labelId="demo-month-label"
        id="demo-month-select"
        value={selectedMonth}
        onChange={handleMonthChange}
      >
        <MenuItem value="All">All</MenuItem>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
          <MenuItem key={month} value={month}>{month}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
  <div>
    <label htmlFor="demo-category-select">Filter By Category:</label>
    <FormControl sx={{ m: 1, width: 100 }}>
      <Select
        labelId="demo-category-label"
        id="demo-category-select"
        value={personName}
        onChange={handleCategoryChange}
        style={{ width: '100px' }}
      >
        {names.map((name) => (
          <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
</div>

      <div>
        <Stack style={{ float: 'right', width: '20%', fontSize: 'larger', paddingTop: '0%' }} direction="row" spacing={2}>
          <Button className="nominateBtn" variant="outlined" startIcon={<LocalLibraryIcon />} onClick={nominateCourses}>
            Nominate
          </Button>
        </Stack>
      </div>
      <br />
      <br />
      <div style={{ paddingTop: '2%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration(Hours)</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selectedCourseIds.includes(row.id)} onChange={(e) => handleCheckboxChange(e, row.id)} />
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row.month}</TableCell>
                  <TableCell>{row.year}</TableCell>
                  <TableCell style={{ color: row.statusColor }}>{row.status}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => handleViewDetails(row)}>View Details</Button>
                    <Button variant="contained" onClick={() => cancelNomination(row.id)} disabled={row.status !== 'Pending for Approval'} style={{ marginLeft: '8px' }}>Cancel</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={showDetails} onClose={handleCloseDetails}>
          <DialogTitle>Course Details</DialogTitle>
          <DialogContent>
            {selectedCourse && (
              <div>
                <h3>{selectedCourse.name}</h3>
                <p>{selectedCourse.description}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Courses;