// import React, { useState } from 'react';
// import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// const MonthlyCourses = () => {
 
//   const [courses, setCourses] = useState([
//     { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', description: 'Course 1 description' },
//     { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', description: 'Course 2 description' },
//     { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', description: 'Course 3 description' },
//     { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', description: 'Course 4 description' },
//     { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', description: 'Course 5 description' },
//     { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', description: 'Course 6 description' },
//     { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', description: 'Course 7 description' },
//     { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', description: 'Course 8 description' },
//     { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', description: 'Course 9 description' },
//     { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', description: 'Course 10 description' },
//     { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', description: 'Course 11 description' },
//   ]);
  
//   const [selectedDomain, setSelectedDomain] = useState('All');
//   const [sortingOrder, setSortingOrder] = useState('ascending');

//   const handleDomainFilterChange = (event) => {
//     const { value } = event.target;
//     setSelectedDomain(value === "All" ? "All" : value);
//   };

//   const handleSortingOrderChange = (event) => {
//     const { value } = event.target;
//     setSortingOrder(value);
//   };

//   const deleteCourse = (id) => {
//     const updatedCourses = courses.filter(course => course.id !== id);
//     setCourses(updatedCourses);
//   };

//   const handleViewDetails = (course) => {
//     setSelectedCourse(course);
//     setShowDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//   };

//   const filteredCourses = courses.filter(course => {
//     if (selectedDomain !== "All") {
//       return course.domain === selectedDomain;
//     } else {
//       return true;
//     }
//   });

//   const sortedCourses = [...filteredCourses].sort((a, b) => {
//     if (sortingOrder === 'ascending') {
//       return a.coursename.localeCompare(b.coursename);
//     } else {
//       return b.coursename.localeCompare(a.coursename);
//     }
//   });

//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   return (
//     <div>
//       <h2>Monthly Courses</h2>

//       <label htmlFor="domainFilter" style={{ fontSize: '1 rem' }}>Filter by Domain:</label>
//       <Select
//         id="domainFilter"
//         value={selectedDomain}
//         onChange={handleDomainFilterChange}
//         sx={{ width: '150px', fontSize: '15px', marginLeft: '10px', color: 'black'}} 
//       >
//         <MenuItem value="All">All</MenuItem>
//         <MenuItem value="Technical">Technical</MenuItem>
//         <MenuItem value="Non-Technical">Non-Technical</MenuItem>
//       </Select>

//       <label htmlFor="sortingOrder" style={{ fontSize: '1 rem', marginLeft: '20px' }}>Sort by Name:</label>
//       <Select
//         id="sortingOrder"
//         value={sortingOrder}
//         onChange={handleSortingOrderChange}
//         sx={{ width: '150px', fontSize: '15px', marginLeft: '10px', color: 'black'}} 
//       >
//         <MenuItem value="ascending">Ascending</MenuItem>
//         <MenuItem value="descending">Descending</MenuItem>
//       </Select>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell align="center">Course Name</TableCell>
//             <TableCell align="center">Duration</TableCell>
//             <TableCell align="center">Domain</TableCell>
//             <TableCell align="center">Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedCourses.map(course => (
//             <TableRow key={course.id}>
//               <TableCell>
//                 {course.coursename}
//                 <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
//               </TableCell>
//               <TableCell align="center">
//                 {course.duration}
//               </TableCell>
//               <TableCell align="center">
//                 {course.domain}
//               </TableCell>
//               <TableCell align="center">
//                 <Button variant="contained" onClick={() => deleteCourse(course.id)}>Delete</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Dialog open={showDetails} onClose={handleCloseDetails}>
//         <DialogTitle>Course Details</DialogTitle>
//         <DialogContent>
//           {selectedCourse && (
//             <div>
//               <h3>{selectedCourse.coursename}</h3>
//               <p>{selectedCourse.description}</p>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDetails}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default MonthlyCourses;


// import React, { useState } from 'react';
// import { Button, Table, TableHead, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// const MonthlyCourses = () => {
 
//   const [courses, setCourses] = useState([
//         { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', description: 'Course 1 description' },
//         { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', description: 'Course 2 description' },
//         { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', description: 'Course 3 description' },
//         { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', description: 'Course 4 description' },
//         { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', description: 'Course 5 description' },
//         { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', description: 'Course 6 description' },
//         { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', description: 'Course 7 description' },
//         { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', description: 'Course 8 description' },
//         { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', description: 'Course 9 description' },
//         { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', description: 'Course 10 description' },
//         { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', description: 'Course 11 description' },
//       ]);

//   const [sortingOrder, setSortingOrder] = useState('ascending');
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   const handleSortingOrderChange = () => {
//     setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
//   };

//   const deleteCourse = (id) => {
//     const updatedCourses = courses.filter(course => course.id !== id);
//     setCourses(updatedCourses);
//   };

//   const handleViewDetails = (course) => {
//     setSelectedCourse(course);
//     setShowDetails(true);
//   };

//   const handleCloseDetails = () => {
//     setShowDetails(false);
//   };

//   const sortedCourses = [...courses].sort((a, b) => {
//     if (sortingOrder === 'ascending') {
//       return a.coursename.localeCompare(b.coursename);
//     } else {
//       return b.coursename.localeCompare(a.coursename);
//     }
//   });

//   return (
//     <div>
//       <h2>Monthly Courses</h2>

//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell align="center">
//               Course Name
//               <Button variant="text" onClick={handleSortingOrderChange}>
//                 {sortingOrder === 'ascending' ? '▲' : '▼'}
//               </Button>
//             </TableCell>
//             <TableCell align="center">Duration</TableCell>
//             <TableCell align="center">Domain</TableCell>
//             <TableCell align="center">Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedCourses.map(course => (
//             <TableRow key={course.id}>
//               <TableCell>{course.coursename}</TableCell>
//               <TableCell align="center">{course.duration}</TableCell>
//               <TableCell align="center">{course.domain}</TableCell>
//               <TableCell align="center">
//                 <Button variant="contained" onClick={() => deleteCourse(course.id)}>Delete</Button>
//                 <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <Dialog open={showDetails} onClose={handleCloseDetails}>
//         <DialogTitle>Course Details</DialogTitle>
//         <DialogContent>
//           {selectedCourse && (
//             <div>
//               <h3>{selectedCourse.coursename}</h3>
//               <p>{selectedCourse.description}</p>
//             </div>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDetails}>Close</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default MonthlyCourses;



import React, { useState } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

const MonthlyCourses = () => {
 
  const [courses, setCourses] = useState([
        { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', description: 'Course 1 description' },
        { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', description: 'Course 2 description' },
        { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', description: 'Course 3 description' },
        { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', description: 'Course 4 description' },
        { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', description: 'Course 5 description' },
        { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', description: 'Course 6 description' },
        { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', description: 'Course 7 description' },
        { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', description: 'Course 8 description' },
        { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', description: 'Course 9 description' },
        { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', description: 'Course 10 description' },
        { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', description: 'Course 11 description' },
      ]);



  const [sortingOrder, setSortingOrder] = useState('ascending');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [domainFilter, setDomainFilter] = useState('All');


  const handleSortingOrderChange = () => {
    setSortingOrder(sortingOrder === 'ascending' ? 'descending' : 'ascending');
  };

  const deleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleDomainFilterChange = (event) => {
    setDomainFilter(event.target.value);

  };

  const sortedCourses = [...courses].sort((a, b) => {
    if (sortingOrder === 'ascending') {
      return a.coursename.localeCompare(b.coursename);
    } else {
      return b.coursename.localeCompare(a.coursename);
    }
  });

  const filteredCourses = sortedCourses.filter(course => {
    if (domainFilter === 'All') {
      return true;
    } else {
      return course.domain === domainFilter;

    }
  });

  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <label>Filter by Domain:</label>
        <Select value={domainFilter} onChange={handleDomainFilterChange} style={{ marginLeft: '10px' }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Technical">Technical</MenuItem>
          <MenuItem value="Non-Technical">Non-Technical</MenuItem>
        </Select>
      </div>

      <h2>Monthly Courses</h2>
      <Table sx={{ backgroundColor: 'white' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">
              Course Name
              <Button variant="text" onClick={handleSortingOrderChange}>
                {sortingOrder === 'ascending' ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </Button>
            </TableCell>
            <TableCell align="center">Duration</TableCell>
            <TableCell align="center">Domain</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCourses.map(course => (
            <TableRow key={course.id}>
              <TableCell>{course.coursename}</TableCell>
              <TableCell align="center">{course.duration}</TableCell>
              <TableCell align="center">{course.domain}</TableCell>
              <TableCell align="center">
                <Button variant="contained" onClick={() => deleteCourse(course.id)}>Delete</Button>
                <Button variant="contained" style={{ marginLeft: '10px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showDetails} onClose={handleCloseDetails}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <div>
              <h3>{selectedCourse.coursename}</h3>
              <p>{selectedCourse.description}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MonthlyCourses;


