// // import React, { useState } from 'react';
// // import './RequestCard.css';
// // import IconButton from '@mui/material/IconButton';
// // import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// // import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// // import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
// // import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// // import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// // const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
// //   const [courseStatus, setCourseStatus] = useState(courses.map((course) => ({ id: course.courseId, accepted: false, rejected: false })));
// //   const [collapsed, setCollapsed] = useState(true);

// //   const handleAccept = (courseId) => {
// //     setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: true, rejected: false } : course)));
// //   };

// //   const handleReject = (courseId) => {
// //     setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: false, rejected: true } : course)));
// //   };

// //   const handleToggleCollapse = () => {
// //     setCollapsed(!collapsed);
// //   };

// //   //added
// //   const [selectedIds, setSelectedIds] = useState([]);
// // //   const handleCheckboxChange = (id) => {
// // //     setSelectedIds((prevSelected) => {
// // //       if (prevSelected.includes(id)) {
// // //         return prevSelected.filter((selectedId) => selectedId !== id);
// // //       } else {
// // //         return [...prevSelected, id];
// // //       }
// // //     });
// // //   };
// //   const [selectedRows, setSelectedRows] = useState([]);

// //   const handleCheckboxChange = (courseId) => {
// //     if (selectedRows.includes(courseId)) {
// //       setSelectedRows(selectedRows.filter((id) => id !== courseId));
// //     } else {
// //       setSelectedRows([...selectedRows, courseId]);
// //     }
// //   };
// //   const isSelected = (id) => selectedIds.includes(id);
// //   const handleAcceptReject = (action) => {
// //     const updatedCourses = courses.map((course) => {
// //       if (isSelected(course.courseId)) {
// //         return {
// //           ...course,
// //           accepted: action === 'accept',
// //           rejected: action === 'reject'
// //         };
// //       }
// //       return course;
// //     });
// //     setCourses(updatedCourses);
// //     setSelectedIds([]);
// //   };

// //   return (
// //     <div className="request-card">
// //       <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center' }}>
// //         {employeeName} {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
// //       </h3>
// //       {!collapsed && (
// //         // <table>
// //         //     <thead>
// //         //         <tr>
// //         //             <th>Course Name</th>
// //         //             <th>Category</th>
// //         //             <th>Duration</th>
// //         //             <th>Action</th>
// //         //         </tr>
// //         //     </thead>
// //         //     <tbody>
// //         //         {courses.map(course => (
// //         //             <tr key={course.courseId} className={`course-row ${courseStatus.find(c => c.id === course.courseId).accepted || courseStatus.find(c => c.id === course.courseId).rejected ? 'greyed-out' : ''}`}>
// //         //                 <td>{course.courseName}</td>
// //         //                 <td>{course.category}</td>
// //         //                 <td>{course.courseDuration}</td>
// //         //                 <td>
// //         //                     {!courseStatus.find(c => c.id === course.courseId).accepted && !courseStatus.find(c => c.id === course.courseId).rejected && (
// //         //                         <>
// //         //                             <button onClick={() => handleAccept(course.courseId)} className="accept-button">Accept</button>
// //         //                             <button onClick={() => handleReject(course.courseId)} className="reject-button">Reject</button>
// //         //                         </>
// //         //                     )}
// //         //                     {courseStatus.find(c => c.id === course.courseId).accepted && <p className="status accepted">Accepted</p>}
// //         //                     {courseStatus.find(c => c.id === course.courseId).rejected && <p className="status rejected">Rejected</p>}
// //         //                 </td>
// //         //             </tr>
// //         //         ))}
// //         //     </tbody>
// //         // </table>
// //         <TableContainer component={Paper}>
// //           <Table>
// //             <TableHead>
// //               <TableRow>
// //                 <TableCell></TableCell>
// //                 <TableCell>Course Name</TableCell>
// //                 <TableCell>Category</TableCell>
// //                 <TableCell>Duration</TableCell>
// //                 <TableCell>Action</TableCell>
// //               </TableRow>
// //             </TableHead>
// //             <TableBody>
// //               {courses.map((course) => (
// //                 <TableRow
// //                   key={course.courseId}
// //                   className={`course-row ${courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected ? 'greyed-out' : ''}`}
// //                 >
// //                   <TableCell>
// //                     <Checkbox
// //                       checked={selectedRows.includes(course.courseId)}
// //                       onChange={() => handleCheckboxChange(course.courseId)}
// //                       disabled={course.accepted || course.rejected}
// //                     />
// //                   </TableCell>
// //                   <TableCell>{course.courseName}</TableCell>
// //                   <TableCell>{course.category}</TableCell>
// //                   <TableCell>{course.courseDuration}</TableCell>
// //                   <TableCell>
// //                     <Button
// //                       className="accept-button"
// //                       disabled={!isSelected(course.id) || course.accepted || course.rejected}
// //                       onClick={() => handleAcceptReject('accept')}
// //                       variant="outlined"
// //                       startIcon={<CheckCircleOutlineIcon />}
// //                     >
// //                       Accept
// //                     </Button>
// //                     <Button
// //                       className="reject-button"
// //                       disabled={!isSelected(course.id) || course.accepted || course.rejected}
// //                       onClick={() => handleAcceptReject('reject')}
// //                       variant="outlined"
// //                       startIcon={<HighlightOffIcon />}
// //                     >
// //                       Reject
// //                     </Button>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </TableContainer>
// //       )}
// //     </div>
// //   );
// // };

// // export default RequestCard;

// import React, { useState } from 'react';
// import './RequestCard.css';
// import IconButton from '@mui/material/IconButton';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
//   const [courseStatus, setCourseStatus] = useState(courses.map((course) => ({ id: course.courseId, accepted: false, rejected: false })));
//   const [collapsed, setCollapsed] = useState(true);
//   const [selectedRows, setSelectedRows] = useState([]);

//   const handleToggleCollapse = () => {
//     setCollapsed(!collapsed);
//   };

//   const handleCheckboxChange = (courseId) => {
//     if (selectedRows.includes(courseId)) {
//       setSelectedRows(selectedRows.filter((id) => id !== courseId));
//     } else {
//       setSelectedRows([...selectedRows, courseId]);
//     }
//   };

//   const isSelected = (courseId) => selectedRows.includes(courseId);

//   const handleAcceptReject = (courseId, action) => {
//     if (action === 'accept') {
//       setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: true, rejected: false } : course)));
//       onAccept(courseId);
//     } else if (action === 'reject') {
//       setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: false, rejected: true } : course)));
//       onReject(courseId);
//     }
//     setSelectedRows([]);
//   };

//   return (
//     <div className="request-card">
//       <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center' }}>
//         {employeeName} {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
//       </h3>
//       {!collapsed && (
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell></TableCell>
//                 <TableCell>Course Name</TableCell>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Duration</TableCell>
//                 <TableCell>Action</TableCell>
//                 <TableCell>Status</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {courses.map((course) => (
//                 <TableRow
//                   key={course.courseId}
//                   className={`course-row ${courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected ? 'greyed-out' : ''}`}
//                 >
//                   <TableCell>
//                     <Checkbox
//                       checked={isSelected(course.courseId)}
//                       onChange={() => handleCheckboxChange(course.courseId)}
//                       disabled={course.accepted || course.rejected}
//                     />
//                   </TableCell>
//                   <TableCell>{course.courseName}</TableCell>
//                   <TableCell>{course.category}</TableCell>
//                   <TableCell>{course.courseDuration}</TableCell>
//                   <TableCell>
//                     <Button
//                       className={`accept-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
//                       disabled={!isSelected(course.courseId) || course.accepted || course.rejected}
//                       onClick={() => handleAcceptReject(course.courseId, 'accept')}
//                       variant="outlined"
//                       startIcon={<CheckCircleOutlineIcon />}
//                     >
//                       Accept
//                     </Button>
//                     <Button
//                       className={`reject-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
//                       disabled={!isSelected(course.courseId) || course.accepted || course.rejected}
//                       onClick={() => handleAcceptReject(course.courseId, 'reject')}
//                       variant="outlined"
//                       startIcon={<HighlightOffIcon />}
//                     >
//                       Reject
//                     </Button>
//                   </TableCell>
//                   <TableCell>
//                     {courseStatus.find((c) => c.id === course.courseId).accepted && <span className="status accepted">Accepted</span>}
//                     {courseStatus.find((c) => c.id === course.courseId).rejected && <span className="status rejected">Rejected</span>}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </div>
//   );
// };

// export default RequestCard;

import React, { useState } from 'react';
import './RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
  const [courseStatus, setCourseStatus] = useState(courses.map((course) => ({ id: course.courseId, accepted: false, rejected: false })));
  const [collapsed, setCollapsed] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const isSelected = (courseId) => selectedRows.includes(courseId);

  const handleAcceptReject = (courseId, action) => {
    if (action === 'accept') {
      setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: true, rejected: false } : course)));
      onAccept(courseId);
    } else if (action === 'reject') {
      setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: false, rejected: true } : course)));
      onReject(courseId);
    }
    setSelectedRows([]);
  };

  return (
    <div className="request-card">
      <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center' }}>
        {employeeName} {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </h3>
      {!collapsed && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow
                  key={course.courseId}
                  className={`course-row ${courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected ? 'greyed-out' : ''}`}
                >
                  <TableCell>{course.courseName}</TableCell>
                  <TableCell>{course.category}</TableCell>
                  <TableCell>{course.courseDuration}</TableCell>
                  <TableCell>
                    <Button
                      className={`accept-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
                      disabled={courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected}
                      onClick={() => handleAcceptReject(course.courseId, 'accept')}
                      variant="outlined"
                      startIcon={<CheckCircleOutlineIcon style={{paddingTop:'10%'}} />}
                      size="small"
                      style={{paddingBottom:'1%'}}

                    >
                      Accept
                    </Button>
                    <Button
                      className={`reject-button ${isSelected(course.courseId) ? 'highlighted' : ''}`}
                      disabled={courseStatus.find((c) => c.id === course.courseId).accepted || courseStatus.find((c) => c.id === course.courseId).rejected}
                      onClick={() => handleAcceptReject(course.courseId, 'reject')}
                      variant="outlined"
                      startIcon={<HighlightOffIcon style={{paddingTop:'10%'}} />}
                      size="small"
                      style={{paddingBottom:'1%'}}
                    >
                      Reject
                    </Button>
                  </TableCell>
                  <TableCell>
                    {courseStatus.find((c) => c.id === course.courseId).accepted && <span className="status accepted">Accepted</span>}
                    {courseStatus.find((c) => c.id === course.courseId).rejected && <span className="status rejected">Rejected</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default RequestCard;
