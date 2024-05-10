import * as React from 'react';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArticleIcon from '@mui/icons-material/Article';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";


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
const names = ['All', 'Technical', 'Domain', 'Power']; // Added 'All' category
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}
function createData(name, category, duration, description) {
  return { name, category, duration, description };
}
const rows = [
  createData('Web development with Python (e.g., Django, Flask)', 'Technical', 4),
  createData('Become an iOS Developer from Scratch', 'Technical', 8),
  createData('Cybersecurity Fundamentals', 'Domain', 3),
  createData('Frontend development with JavaScript (e.g., React.js, Angular, Vue.js)', 'Technical', 5),
  createData('Effective Presentation Skills', 'Power', 2),
  createData('Mindfulness and Stress Management', 'Power', 1.5),
  createData('Financial Analysis and Reporting', 'Domain', 4),
  createData('Learn Flutter - Beginners Course', 'Technical', 2),
  createData('Agile Scrum Fundamentals for Product Managers', 'Domains', 2),
  createData('MEAN/MERN stack development (MongoDB, Express.js, Angular/React.js, Node.js)', 'Technical', 8),
  createData('Product Lifecycle Management (PLM)', 'Domain', 3),
  createData('React JS For Beginners', 'Technical', 2),
  createData('Data Visualization using Python ', 'Technical', 2.5),
  createData('Microsoft Azure Application', 'Technical', 2),
  createData('Google Cloud Platform for Beginners', 'Technical', 1),
  createData('Writing Powerful Business Reports', 'Power', 1.5),
  createData('Emotional Intelligence in the workplace', 'Power', 1),
  createData('Spring Framework for Java development', 'Technical', 6),
];
function Courses() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState('All'); // Default category set to 'All'
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  const [showDetails, setShowDetails] = React.useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(value); // Update selected category
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const filteredRows = personName === 'All' ? rows : rows.filter(row => row.category === personName);

  useEffect(() => {
    const getData = async () => {
      try {
        const temp = await axios.get("/course")

        console.log(temp.data);
      } catch (err) {
        console.log(err)
      }
    }
    getData();
  })

  return (
    <div>
      {/* Dropdown(single select) */}
      <div style={{ display: 'inline-block' }}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-category-label" >Category</InputLabel>
          <Select
            id='demo-multiple-category'
            labelId="demo-multiple-category-label"
            variant="outlined"
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="category" />}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* Nominate Btn */}
      <div>
        <Stack style={{ float: 'right', width: '20%', fontSize: 'larger', paddingTop: '0%' }} direction="row" spacing={2}>
          <Button className="nominateBtn" variant="outlined" startIcon={<LocalLibraryIcon />} onClick={() => navigate('/courses/nominate')}>
            Nominate
          </Button>
        </Stack>
      </div>
      <br />
      <br />
      {/* monthly available courses table  */}
      <div style={{ paddingTop: '2%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration(Hours)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell style={{ paddingRight: '5%' }} component="th" scope="row">
                    {row.name}
                    <div>
                      <Button variant="contained" style={{ marginLeft: '500px', marginRight: '-100px' }} onClick={() => handleViewDetails(row)}>View Details</Button>
                    </div>
                  </TableCell>
                  <TableCell style={{ margin: 'auto' }}>{row.category}</TableCell>
                  <TableCell style={{ paddingLeft: '5%' }}>{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Course Details Dialog */}
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
