// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from "react-router-dom";
// // import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
// // import AddCourse from './AddCourse';

// // const AllCourses = () => {
// //   // Dummy data for courses (replace with actual data)
// //   const navigate = useNavigate();
// //   const handleClick = () => {
// //     navigate("/AllCourses/add-course")
// //   };
// //   const [courses, setCourses] = useState([
// //     { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 1 description' },
// //     { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 2 description' },
// //     { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 3 description' },
// //     { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 4 description' },
// //     { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 5 description' },
// //     { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 6 description' },
// //     { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', status: 'inactive', description: 'Course 7 description' },
// //     { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 8 description' },
// //     { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 9 description' },
// //     { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 10 description' },
// //     { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 11 description' },
// //   ]);

// //   // Add more courses here

// //   const [showAddCourse, setShowAddCourse] = useState(false);
// //   const handleCourseAdd = (newCourse) => {
// //     setCourses([...courses, { ...newCourse, status: 'inactive' }]);
// //     setShowAddCourse(false); // Hide the Add Course form after adding
// //   };
// //   // State for selected domain filter
// //   const [selectedDomain, setSelectedDomain] = useState("All");
// //   // State for currently editing course
// //   const [editingCourseId, setEditingCourseId] = useState(null);
// //   // State for editing fields
// //   const [editFields, setEditFields] = useState({});
// //   // State for viewing details
// //   const [selectedCourse, setSelectedCourse] = useState(null);
// //   const [showDetails, setShowDetails] = useState(false);
// //   // State for selected rows
// //   const [selectedRows, setSelectedRows] = useState([]);
// //   // State for button activation
// //   const [isActivateButtonEnabled, setIsActivateButtonEnabled] = useState(false);
// //   // Function to handle domain filter change
// //   const handleDomainFilterChange = (event) => {
// //     const {value} = event.target;
// //     setSelectedDomain(value=="All"?"All":value);
// //   };
// //   // Function to delete a course
// //   const deleteCourse = (id) => {
// //     // Filter out the course with the given id
// //     const updatedCourses = courses.filter(course => course.id !== id);
// //     // Update the state with the filtered courses
// //     setCourses(updatedCourses);
// //   };
// //   // Function to handle editing a course
// //   const handleEditCourse = (id) => {
// //     setEditingCourseId(id);
// //     // Set the editing fields based on the course being edited
// //     const courseToEdit = courses.find(course => course.id === id);
// //     setEditFields(courseToEdit);
// //   };
// //   // Function to handle input change for editing fields
// //   const handleEditFieldChange = (event, fieldName) => {
// //     const { value } = event.target;
// //     setEditFields(prevState => ({
// //       ...prevState,
// //       [fieldName]: value
// //     }));
// //   };
// //   // Function to save edited course
// //   const saveEditedCourse = () => {
// //     // Update the course with the edited fields
// //     const updatedCourses = courses.map(course => {
// //       if (course.id === editingCourseId) {
// //         return { ...course, ...editFields };
// //       }
// //       return course;
// //     });
// //     setCourses(updatedCourses);
// //     // Reset editing state
// //     setEditingCourseId(null);
// //     setEditFields({});
// //   };
// //   // Function to cancel editing
// //   const cancelEditing = () => {
// //     // Reset editing state
// //     setEditingCourseId(null);
// //     setEditFields({});
// //   };
// //   // Function to handle viewing details
// //   const handleViewDetails = (course) => {
// //     setSelectedCourse(course);
// //     setShowDetails(true);
// //   };
// //   // Function to close details modal
// //   const handleCloseDetails = () => {
// //     setShowDetails(false);
// //   };
// //   // Function to handle selecting a row
// //   const handleRowCheckboxChange = (event, courseId) => {
// //     if (event.target.checked) {
// //       setSelectedRows([...selectedRows, courseId]);
// //     } else {
// //       setSelectedRows(selectedRows.filter(id => id !== courseId));
// //     }
// //   };
// //   // Function to handle selecting all rows
// //   const handleSelectAllClick = (event) => {
// //     if (event.target.checked) {
// //       const newSelectedRows = filteredCourses.map(course => course.id);
// //       setSelectedRows(newSelectedRows);
// //     } else {
// //       setSelectedRows([]);
// //     }
// //   };
// //   // Function to check if a row is selected
// //   const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;
// //   // Function to handle Activate button click
// //   const handleActivateButtonClick = () => {
// //     const updatedCourses = courses.map(course => {
// //       if (selectedRows.includes(course.id)) {
// //         // Toggle between 'active' and 'inactive' statuses
// //         return { ...course, status: course.status === 'active' ? 'inactive' : 'active' };
// //       }
// //       return course;
// //     });
// //     setCourses(updatedCourses);
// //     setSelectedRows([]); // Clear selected rows
// //     setIsActivateButtonEnabled(false); // Disable the button after activation
// //   };
// //   // Function to handle activation button
// //   useEffect(() => {
// //     setIsActivateButtonEnabled(selectedRows.length > 0);
// //   }, [selectedRows]);

// //   // Filter courses based on selected domain
// //   const filteredCourses = courses.filter(course => {
// //     if (selectedDomain==="All") {
// //       return true;
// //     } else {
// //       return course.domain === selectedDomain;
// //     }
// //   });

// //   return (
// //     <div>
// //       <h2>All Courses</h2>

// //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
// //         {/* Domain filter */}
// //         <div style={{ flex: '1', marginRight: '10px' }}>
// //           <label htmlFor="domainFilter">Filter by Domain:</label>
// //           <Select
// //             id="domainFilter"
// //             value={selectedDomain}
// //             onChange={handleDomainFilterChange}
// //             style={{ width: '150px' }}
// //           >
// //             <MenuItem value="All">All</MenuItem>
// //             <MenuItem value="Technical">Technical</MenuItem>
// //             <MenuItem value="Non-Technical">Non-Technical</MenuItem>
// //           </Select>
// //         </div>

// //         {/* Add Course Button */}
// //         <Button variant="contained" onClick={handleClick} style={{ marginRight: '10px' }}>
// //           Add Course
// //         </Button>

// //         {/* Activate Button */}
// //         <Button
// //           variant="contained"
// //           disabled={!isActivateButtonEnabled}
// //           onClick={handleActivateButtonClick}
// //         >
// //          Change Status
// //         </Button>
// //       </div>

// //       {showAddCourse && <AddCourse onCourseAdd={handleCourseAdd} />}

// //       {/* Table */}
// //       <Table  style={{ backgroundColor: 'white' }}>
// //         <TableHead>
// //           <TableRow>
// //             <TableCell padding="checkbox">
// //               <Checkbox
// //                 indeterminate={selectedRows.length > 0 && selectedRows.length < filteredCourses.length}
// //                 checked={selectedRows.length === filteredCourses.length}
// //                 onChange={handleSelectAllClick}
// //                 inputProps={{ 'aria-label': 'select all courses' }}
// //               />
// //             </TableCell>

// //             <TableCell align="center">Course Name</TableCell>
// //             <TableCell align="center">Duration</TableCell>
// //             <TableCell align="center">Domain</TableCell>
// //             <TableCell align="center">Status</TableCell>
// //             <TableCell align="center">Action</TableCell>
// //           </TableRow>
// //         </TableHead>
// //         <TableBody>
// //           {filteredCourses.map(course => (
// //             <TableRow key={course.id} hover role="checkbox" tabIndex={-1} selected={isSelected(course.id)}>
// //               <TableCell padding="checkbox">
// //                 <Checkbox
// //                   checked={isSelected(course.id)}
// //                   onChange={(event) => handleRowCheckboxChange(event, course.id)}
// //                   inputProps={{ 'aria-labelledby': `checkbox-${course.id}` }}
// //                 />
// //               </TableCell>
// //               <TableCell>
// //                 {editingCourseId === course.id ? (
// //                   <TextField
// //                     value={editFields.coursename || course.coursename}
// //                     onChange={(event) => handleEditFieldChange(event, 'coursename')}
// //                   />
// //                 ) : (
// //                   <div>
// //                     {course.coursename}
// //                     <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
// //                   </div>
// //                 )}
// //               </TableCell>
// //               <TableCell align="center">
// //                 {editingCourseId === course.id ? (
// //                   <TextField
// //                     value={editFields.duration || course.duration}
// //                     onChange={(event) => handleEditFieldChange(event, 'duration')}
// //                   />
// //                 ) : (
// //                   course.duration
// //                 )}
// //               </TableCell>
// //               <TableCell align="center">
// //                 {editingCourseId === course.id ? (
// //                   <TextField
// //                     value={editFields.domain || course.domain}
// //                     onChange={(event) => handleEditFieldChange(event, 'domain')}
// //                   />
// //                 ) : (
// //                   course.domain
// //                 )}
// //               </TableCell>
// //               <TableCell align="center">
// //               <span style={{ color: course.status === 'inactive' ? 'red' : 'green' }}>
// //     {course.status}
// //   </span>
// //               </TableCell>
// //               <TableCell align="center">
// //                 {editingCourseId === course.id ? (
// //                   <>
// //                     <Button variant="contained" onClick={saveEditedCourse}>Save</Button>
// //                     <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '10px' }}>Cancel</Button>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Button variant="contained" onClick={() => handleEditCourse(course.id)}>Edit</Button>
// //                     <Button variant="contained" onClick={() => deleteCourse(course.id)} style={{ marginLeft: '10px' }}>Delete</Button>
// //                   </>
// //                 )}
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// //       {/* Course Details Dialog */}
// //       <Dialog open={showDetails} onClose={handleCloseDetails}>
// //         <DialogTitle>Course Details</DialogTitle>
// //         <DialogContent>
// //           {selectedCourse && (
// //             <div>
// //               <h3>{selectedCourse.coursename}</h3>
// //               <p>{selectedCourse.description}</p>
// //             </div>
// //           )}
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCloseDetails}>Close</Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // };

// // export default AllCourses;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import { Button, Table, TableHead, TableBody, TableCell, TableRow, Select, MenuItem, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
// import AddCourse from './AddCourse';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// const AllCourses = () => {
//   // Dummy data for courses (replace with actual data)
//   const navigate = useNavigate();
//   const handleClick = () => {
//     navigate("/AllCourses/add-course")
//   };
//   const [courses, setCourses] = useState([
//     { id: 1, coursename: 'Course 1', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 1 description' },
//     { id: 2, coursename: 'Course 2', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 2 description' },
//     { id: 3, coursename: 'Course 3', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 3 description' },
//     { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 4 description' },
//     { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 5 description' },
//     { id: 6, coursename: 'Course 6', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 6 description' },
//     { id: 7, coursename: 'Course 7', duration: '2 months', domain: 'Non-Technical', status: 'inactive', description: 'Course 7 description' },
//     { id: 8, coursename: 'Course 8', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 8 description' },
//     { id: 9, coursename: 'Course 9', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 9 description' },
//     { id: 10, coursename: 'Course 10', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 10 description' },
//     { id: 11, coursename: 'Course 11', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 11 description' },
//   ]);

//   // Add more courses here

//   const [showAddCourse, setShowAddCourse] = useState(false);
//   const handleCourseAdd = (newCourse) => {
//     setCourses([...courses, { ...newCourse, status: 'inactive' }]);
//     setShowAddCourse(false); // Hide the Add Course form after adding
//   };
//   // State for selected domain filter
//   const [selectedDomain, setSelectedDomain] = useState("All");
//   // State for currently editing course
//   const [editingCourseId, setEditingCourseId] = useState(null);
//   // State for editing fields
//   const [editFields, setEditFields] = useState({});
//   // State for viewing details
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);
//   // State for selected rows
//   const [selectedRows, setSelectedRows] = useState([]);
//   // State for button activation
//   const [isActivateButtonEnabled, setIsActivateButtonEnabled] = useState(false);
//   // State for sorting
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
//   // Function to handle domain filter change
//   const handleDomainFilterChange = (event) => {
//     const {value} = event.target;
//     setSelectedDomain(value=="All"?"All":value);
//   };
//   // Function to delete a course
//   const deleteCourse = (id) => {
//     // Filter out the course with the given id
//     const updatedCourses = courses.filter(course => course.id !== id);
//     // Update the state with the filtered courses
//     setCourses(updatedCourses);
//   };
//   // Function to handle editing a course
//   const handleEditCourse = (id) => {
//     setEditingCourseId(id);
//     // Set the editing fields based on the course being edited
//     const courseToEdit = courses.find(course => course.id === id);
//     setEditFields(courseToEdit);
//   };
//   // Function to handle input change for editing fields
//   const handleEditFieldChange = (event, fieldName) => {
//     const { value } = event.target;
//     setEditFields(prevState => ({
//       ...prevState,
//       [fieldName]: value
//     }));
//   };
//   // Function to save edited course
//   const saveEditedCourse = () => {
//     // Update the course with the edited fields
//     const updatedCourses = courses.map(course => {
//       if (course.id === editingCourseId) {
//         return { ...course, ...editFields };
//       }
//       return course;
//     });
//     setCourses(updatedCourses);
//     // Reset editing state
//     setEditingCourseId(null);
//     setEditFields({});
//   };
//   // Function to cancel editing
//   const cancelEditing = () => {
//     // Reset editing state
//     setEditingCourseId(null);
//     setEditFields({});
//   };
//   // Function to handle viewing details
//   const handleViewDetails = (course) => {
//     setSelectedCourse(course);
//     setShowDetails(true);
//   };
//   // Function to close details modal
//   const handleCloseDetails = () => {
//     setShowDetails(false);
//   };
//   // Function to handle selecting a row
//   const handleRowCheckboxChange = (event, courseId) => {
//     if (event.target.checked) {
//       setSelectedRows([...selectedRows, courseId]);
//     } else {
//       setSelectedRows(selectedRows.filter(id => id !== courseId));
//     }
//   };
//   // Function to handle selecting all rows
//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelectedRows = filteredCourses.map(course => course.id);
//       setSelectedRows(newSelectedRows);
//     } else {
//       setSelectedRows([]);
//     }
//   };
//   // Function to check if a row is selected
//   const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;
//   // Function to handle Activate button click
//   const handleActivateButtonClick = () => {
//     const updatedCourses = courses.map(course => {
//       if (selectedRows.includes(course.id)) {
//         // Toggle between 'active' and 'inactive' statuses
//         return { ...course, status: course.status === 'active' ? 'inactive' : 'active' };
//       }
//       return course;
//     });
//     setCourses(updatedCourses);
//     setSelectedRows([]); // Clear selected rows
//     setIsActivateButtonEnabled(false); // Disable the button after activation
//   };
//   // Function to handle activation button
//   useEffect(() => {
//     setIsActivateButtonEnabled(selectedRows.length > 0);
//   }, [selectedRows]);

//   // Function to handle sorting
//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   // Filter courses based on selected domain
//   const filteredCourses = courses.filter(course => {
//     if (selectedDomain==="All") {
//       return true;
//     } else {
//       return course.domain === selectedDomain;
//     }
//   });

//   // Apply sorting
//   const sortedCourses = [...filteredCourses].sort((a, b) => {
//     if (sortConfig === null) {
//       return 0;
//     }
//     const { key, direction } = sortConfig;
//     if (a[key] < b[key]) {
//       return direction === 'ascending' ? -1 : 1;
//     }
//     if (a[key] > b[key]) {
//       return direction === 'ascending' ? 1 : -1;
//     }
//     return 0;
//   });

//   return (
//     <div>
//       <h2>All Courses</h2>

//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
//         {/* Domain filter */}
//         <div style={{ flex: '1', marginRight: '10px' }}>
//           <label htmlFor="domainFilter">Filter by Domain:</label>
//           <Select
//             id="domainFilter"
//             value={selectedDomain}
//             onChange={handleDomainFilterChange}
//             style={{ width: '150px' }}
//           >
//             <MenuItem value="All">All</MenuItem>
//             <MenuItem value="Technical">Technical</MenuItem>
//             <MenuItem value="Non-Technical">Non-Technical</MenuItem>
//           </Select>
//         </div>

//         {/* Add Course Button */}
//         <Button variant="contained" onClick={handleClick} style={{ marginRight: '10px' }}>
//           Add Course
//         </Button>

//         {/* Activate Button */}
//         <Button
//           variant="contained"
//           disabled={!isActivateButtonEnabled}
//           onClick={handleActivateButtonClick}
//         >
//          Change Status
//         </Button>
//       </div>

//       {showAddCourse && <AddCourse onCourseAdd={handleCourseAdd} />}

//       {/* Table */}
//       <Table  style={{ backgroundColor: 'white' }}>
//         <TableHead>
//           <TableRow>
//             <TableCell padding="checkbox">
//               <Checkbox
//                 indeterminate={selectedRows.length > 0 && selectedRows.length < filteredCourses.length}
//                 checked={selectedRows.length === filteredCourses.length}
//                 onChange={handleSelectAllClick}
//                 inputProps={{ 'aria-label': 'select all courses' }}
//               />
//             </TableCell>

//             <TableCell align="center" onClick={() => requestSort('coursename')}>
//               Course Name
//               {sortConfig && sortConfig.key === 'coursename' && (
//                 sortConfig.direction === 'ascending' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
//               )}
//             </TableCell>
//             <TableCell align="center" onClick={() => requestSort('duration')}>
//               Duration
//               {sortConfig && sortConfig.key === 'duration' && (
//                 sortConfig.direction === 'ascending' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
//               )}
//             </TableCell>
//             <TableCell align="center" onClick={() => requestSort('domain')}>
//               Domain
//               {sortConfig && sortConfig.key === 'domain' && (
//                 sortConfig.direction === 'ascending' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
//               )}
//             </TableCell>
//             <TableCell align="center" onClick={() => requestSort('status')}>
//               Status
//               {sortConfig && sortConfig.key === 'status' && (
//                 sortConfig.direction === 'ascending' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
//               )}
//             </TableCell>
//             <TableCell align="center">Action</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {sortedCourses.map(course => (
//             <TableRow key={course.id} hover role="checkbox" tabIndex={-1} selected={isSelected(course.id)}>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={isSelected(course.id)}
//                   onChange={(event) => handleRowCheckboxChange(event, course.id)}
//                   inputProps={{ 'aria-labelledby': `checkbox-${course.id}` }}
//                 />
//               </TableCell>
//               <TableCell>
//                 {editingCourseId === course.id ? (
//                   <TextField
//                     value={editFields.coursename || course.coursename}
//                     onChange={(event) => handleEditFieldChange(event, 'coursename')}
//                   />
//                 ) : (
//                   <div>
//                     {course.coursename}
//                     <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
//                   </div>
//                 )}
//               </TableCell>
//               <TableCell align="center">
//                 {editingCourseId === course.id ? (
//                   <TextField
//                     value={editFields.duration || course.duration}
//                     onChange={(event) => handleEditFieldChange(event, 'duration')}
//                   />
//                 ) : (
//                   course.duration
//                 )}
//               </TableCell>
//               <TableCell align="center">
//                 {editingCourseId === course.id ? (
//                   <TextField
//                     value={editFields.domain || course.domain}
//                     onChange={(event) => handleEditFieldChange(event, 'domain')}
//                   />
//                 ) : (
//                   course.domain
//                 )}
//               </TableCell>
//               <TableCell align="center">
//               <span style={{ color: course.status === 'inactive' ? 'red' : 'green' }}>
//     {course.status}
//   </span>
//               </TableCell>
//               <TableCell align="center">
//                 {editingCourseId === course.id ? (
//                   <>
//                     <Button variant="contained" onClick={saveEditedCourse}>Save</Button>
//                     <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '10px' }}>Cancel</Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button variant="contained" onClick={() => handleEditCourse(course.id)}>Edit</Button>
//                     <Button variant="contained" onClick={() => deleteCourse(course.id)} style={{ marginLeft: '10px' }}>Delete</Button>
//                   </>
//                 )}
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//       {/* Course Details Dialog */}
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

// export default AllCourses;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import AddCourse from './AddCourse';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const AllCourses = () => {
  // Dummy data for courses (replace with actual data)
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/AllCourses/add-course');
  };
  const [courses, setCourses] = useState([
    { id: 1, coursename: 'AI', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 1 description' },
    { id: 2, coursename: 'ML', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 2 description' },
    { id: 3, coursename: 'DL', duration: '1 month', domain: 'Non-Technical', status: 'inactive', description: 'Course 3 description' },
    { id: 4, coursename: 'Course 4', duration: '2 months', domain: 'Technical', status: 'inactive', description: 'Course 4 description' },
    { id: 5, coursename: 'Course 5', duration: '3 months', domain: 'Technical', status: 'inactive', description: 'Course 5 description' },
    {
      id: 6,
      coursename: 'Course 6',
      duration: '1 month',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 6 description'
    },
    {
      id: 7,
      coursename: 'Course 7',
      duration: '2 months',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 7 description'
    },
    {
      id: 8,
      coursename: 'Become an iOS Developer from Scratch and Agile Scrum Fundamentals for Product Managers',
      duration: '1 month',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 8 description'
    },
    {
      id: 9,
      coursename: 'Course 9',
      duration: '1 month',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 9 description'
    },
    {
      id: 10,
      coursename: 'Course 10',
      duration: '1 month',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 10 description'
    },
    {
      id: 11,
      coursename: 'Course 11',
      duration: '1 month',
      domain: 'Non-Technical',
      status: 'inactive',
      description: 'Course 11 description'
    }
  ]);

  // Add more courses here

  const [showAddCourse, setShowAddCourse] = useState(false);
  const handleCourseAdd = (newCourse) => {
    setCourses([...courses, { ...newCourse, status: 'inactive' }]);
    setShowAddCourse(false); // Hide the Add Course form after adding
  };
  // State for selected domain filter
  const [selectedDomain, setSelectedDomain] = useState('All');
  // State for currently editing course
  const [editingCourseId, setEditingCourseId] = useState(null);
  // State for editing fields
  const [editFields, setEditFields] = useState({});
  // State for viewing details
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  // State for button activation
  const [isActivateButtonEnabled, setIsActivateButtonEnabled] = useState(false);
  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // Function to handle domain filter change
  const handleDomainFilterChange = (event) => {
    const { value } = event.target;
    setSelectedDomain(value == 'All' ? 'All' : value);
  };
  // Function to delete a course
  const deleteCourse = (id) => {
    // Filter out the course with the given id
    const updatedCourses = courses.filter((course) => course.id !== id);
    // Update the state with the filtered courses
    setCourses(updatedCourses);
  };
  // Function to handle editing a course
  const handleEditCourse = (id) => {
    setEditingCourseId(id);
    // Set the editing fields based on the course being edited
    const courseToEdit = courses.find((course) => course.id === id);
    setEditFields(courseToEdit);
  };
  // Function to handle input change for editing fields
  const handleEditFieldChange = (event, fieldName) => {
    const { value } = event.target;
    setEditFields((prevState) => ({
      ...prevState,
      [fieldName]: value
    }));
  };
  // Function to save edited course
  const saveEditedCourse = () => {
    // Update the course with the edited fields
    const updatedCourses = courses.map((course) => {
      if (course.id === editingCourseId) {
        return { ...course, ...editFields };
      }
      return course;
    });
    setCourses(updatedCourses);
    // Reset editing state
    setEditingCourseId(null);
    setEditFields({});
  };
  // Function to cancel editing
  const cancelEditing = () => {
    // Reset editing state
    setEditingCourseId(null);
    setEditFields({});
  };
  // Function to handle viewing details
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowDetails(true);
  };
  // Function to close details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
  };
  // Function to handle selecting a row
  const handleRowCheckboxChange = (event, courseId) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, courseId]);
    } else {
      setSelectedRows(selectedRows.filter((id) => id !== courseId));
    }
  };
  // Function to handle selecting all rows
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedRows = filteredCourses.map((course) => course.id);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };
  // Function to check if a row is selected
  const isSelected = (courseId) => selectedRows.indexOf(courseId) !== -1;
  // Function to handle Activate button click
  const handleActivateButtonClick = () => {
    const updatedCourses = courses.map((course) => {
      if (selectedRows.includes(course.id)) {
        // Toggle between 'active' and 'inactive' statuses
        return { ...course, status: course.status === 'active' ? 'inactive' : 'active' };
      }
      return course;
    });
    setCourses(updatedCourses);
    setSelectedRows([]); // Clear selected rows
    setIsActivateButtonEnabled(false); // Disable the button after activation
  };
  // Function to handle activation button
  useEffect(() => {
    setIsActivateButtonEnabled(selectedRows.length > 0);
  }, [selectedRows]);

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter courses based on selected domain
  const filteredCourses = courses.filter((course) => {
    if (selectedDomain === 'All') {
      return true;
    } else {
      return course.domain === selectedDomain;
    }
  });

  // Apply sorting
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortConfig === null) {
      return 0;
    }
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div>
      <h2>All Courses</h2>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Domain filter */}
        <div style={{ flex: '1', marginRight: '10px' }}>
          <label htmlFor="domainFilter" style={{paddingRight:'1%'}}>Filter by Domain:</label>
          <Select id="domainFilter" value={selectedDomain} onChange={handleDomainFilterChange} style={{ width: '150px' }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Technical">Technical</MenuItem>
            <MenuItem value="Non-Technical">Non-Technical</MenuItem>
          </Select>
        </div>

        

        {/* Add Course Button */}
        <Button variant="contained" onClick={handleClick} style={{ marginRight: '10px' }}>
          Add Course
        </Button>

        {/* Activate Button */}
        <Button variant="contained" disabled={!isActivateButtonEnabled} onClick={handleActivateButtonClick}>
          Change Status
        </Button>
      </div>

      {showAddCourse && <AddCourse onCourseAdd={handleCourseAdd} />}

      {/* Table */}
      <Table style={{ backgroundColor: 'white' }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedRows.length > 0 && selectedRows.length < filteredCourses.length}
                checked={selectedRows.length === filteredCourses.length}
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all courses' }}
              />
            </TableCell>

            <TableCell align="center" onClick={() => requestSort('coursename')}>
              Course Name
              <ArrowDropDownIcon style={{ fontSize: '130%' }}  />
            </TableCell>
            <TableCell align="center" onClick={() => requestSort('duration')}>
              Duration
              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
            </TableCell>
            <TableCell align="center" onClick={() => requestSort('domain')}>
              Domain
              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
            </TableCell>
            <TableCell align="center" onClick={() => requestSort('status')}>
              Status
              <ArrowDropDownIcon style={{ fontSize: '130%' }} />
            </TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCourses.map((course) => (
            <TableRow key={course.id} hover role="checkbox" tabIndex={-1} selected={isSelected(course.id)}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={isSelected(course.id)}
                  onChange={(event) => handleRowCheckboxChange(event, course.id)}
                  inputProps={{ 'aria-labelledby': `checkbox-${course.id}` }}
                />
              </TableCell>
              {/* <TableCell>
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.coursename || course.coursename}
                    onChange={(event) => handleEditFieldChange(event, 'coursename')}
                  />
                ) : (
                  <div>
                    {course.coursename}
                    <Button variant="contained" style={{ marginLeft: '50px', marginRight: '-100px' }} onClick={() => handleViewDetails(course)}>View Details</Button>
                  </div>
                )}
              </TableCell> */}
              {/* style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} */}

              <TableCell  >
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.coursename || course.coursename}
                    onChange={(event) => handleEditFieldChange(event, 'coursename')}
                  />
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'  }}>
                    <span style={{maxWidth:'200px', paddingTop:'2%'}}>{course.coursename}</span>
                    <Button variant="contained" onClick={() => handleViewDetails(course)}>
                      View Details
                    </Button>
                  </div>
                )}
              </TableCell>

              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <TextField
                    value={editFields.duration || course.duration}
                    onChange={(event) => handleEditFieldChange(event, 'duration')}
                  />
                ) : (
                  course.duration
                )}
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <TextField value={editFields.domain || course.domain} onChange={(event) => handleEditFieldChange(event, 'domain')} />
                ) : (
                  course.domain
                )}
              </TableCell>
              <TableCell align="center">
                <span style={{ color: course.status === 'inactive' ? 'red' : 'green' }}>{course.status}</span>
              </TableCell>
              <TableCell align="center">
                {editingCourseId === course.id ? (
                  <>
                    <Button variant="contained" onClick={saveEditedCourse}>
                      Save
                    </Button>
                    <Button variant="contained" onClick={cancelEditing} style={{ marginLeft: '10px' }}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => handleEditCourse(course.id)}>
                      Edit
                    </Button>
                    <Button variant="contained" onClick={() => deleteCourse(course.id)} style={{ marginLeft: '10px' }}>
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Course Details Dialog */}
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

export default AllCourses;
