import * as React from 'react';
import Button from '@mui/material/Button';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ArticleIcon from '@mui/icons-material/Article';
// import CategoryIcon from '@mui/icons-material/Category';
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
<<<<<<< HEAD

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
=======
import { useNavigate } from "react-router-dom";
import Nominate from './Nominate';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
<<<<<<< HEAD

const names = ['technical', 'domain', 'power'];

=======
const names = ['technical', 'domain', 'power'];
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
  };
}
<<<<<<< HEAD

function createData(name, category, duration) {
  return { name, category, duration };
}

=======
function createData(name, category, duration) {
  return { name, category, duration };
}
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
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
<<<<<<< HEAD
  createData('Data Visualization using Python	', 'Technical', 2.5),
=======
  createData('Data Visualization using Python ', 'Technical', 2.5),
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
  createData('Microsoft Azure Application', 'Technical', 2),
  createData('Google Cloud Platform for Beginners', 'Technical', 1),
  createData('Writing Powerful Business Reports', 'Power', 1.5),
  createData('Emotional Intelligence in the workplace', 'Power', 1),
<<<<<<< HEAD
  createData('Spring Framework for Java development', 'Technical', 6), 
  
];

function Courses() {
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

=======
  createData('Spring Framework for Java development', 'Technical', 6),
];
function Courses() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
<<<<<<< HEAD

=======
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
  return (
    <div>
      {/* Dropdown(multiple select) */}
      <div style={{display:'inline-block'}}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-category-label" >Category</InputLabel>
          {/* <InputLabel id="test-select-label" variant="outlined" startIcon={<CategoryIcon />}>Category</InputLabel> */}
          <Select
            id='demo-multiple-category'
            // startIcon={<CategoryIcon />}
            labelId="demo-multiple-category-label"
            variant="outlined"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="category" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
<<<<<<< HEAD


      {/* Nominate Btn */}
      <div>
        <Stack style={{ float: 'right', width: '20%', fontSize:'larger', paddingTop:'0%' }} direction="row" spacing={2}>
          <Button className="nominateBtn" variant="outlined" startIcon={<LocalLibraryIcon />}>
=======
      {/* Nominate Btn */}
      <div>
        <Stack style={{ float: 'right', width: '20%', fontSize:'larger', paddingTop:'0%' }} direction="row" spacing={2}>
          <Button className="nominateBtn" variant="outlined" startIcon={<LocalLibraryIcon />} onClick={() => navigate('/courses/nominate ')}>
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
            Nominate
          </Button>
        </Stack>
      </div>
      <br />
      <br />
<<<<<<< HEAD

=======
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
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
              {rows.map((row) => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell style={{ paddingRight: '5%' }} component="th" scope="row">
                    {row.name}
                    <Button className="vdBtn" style={{ float: 'right', fontSize: 'small' }} variant="outlined" startIcon={<ArticleIcon />}>
                      View Details
                    </Button>
                  </TableCell>
                  <TableCell style={{ margin: 'auto' }}>{row.category}</TableCell>
                  <TableCell style={{ paddingLeft: '5%' }}>{row.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
<<<<<<< HEAD

export default Courses;
=======
export default Courses;
>>>>>>> 9c066688b8b7fabeeea6d6fc0b5c21fbbe776df2
