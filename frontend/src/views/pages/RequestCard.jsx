<<<<<<< Updated upstream
// import React, { useState } from 'react';
// import './RequestCard.css';
// import Button from '@mui/material/Button';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// const RequestCard = ({ employeeName, courses = [], onAccept, onReject, onRemove }) => {
//   const [courseStatus, setCourseStatus] = useState(courses.map((course) => ({ id: course.courseId, accepted: false, rejected: false })));
//   const [submitted, setSubmitted] = useState(false);
//   const [showCourses, setShowCourses] = useState(false);
=======
import React, { useState } from 'react';
import './RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
    const [courseStatus, setCourseStatus] = useState(courses.map(course => ({ id: course.courseId, accepted: false, rejected: false })));
    const [collapsed, setCollapsed] = useState(true);
>>>>>>> Stashed changes

//   const handleAccept = (courseId) => {
//     setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: true, rejected: false } : course)));
//   };

//   const handleReject = (courseId) => {
//     setCourseStatus(courseStatus.map((course) => (course.id === courseId ? { ...course, accepted: false, rejected: true } : course)));
//   };

<<<<<<< Updated upstream
//   const handleSubmit = () => {
//     const allCoursesReviewed = courseStatus.every((course) => course.accepted || course.rejected);
//     if (allCoursesReviewed) {
//       setSubmitted(true);
//       onRemove(); // Call onRemove to remove the card
//     } else {
//       alert('Please accept or reject all courses before submitting.');
//     }
//   };

//   return (
//     <div className="request-card">
//       <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: 'pointer' }}>
//         {employeeName} {showCourses ? '▼' : '▶'}
//       </h3>
//       {showCourses && (
//         <div>
//           {courses.map((course) => (
//             <div key={course.courseId} className="course-container">
//               <div className="course-details">
//                 <p>
//                   <b>Course: {course.courseName}</b>
//                 </p>
//                 <p>
//                   <b>Category:</b> {course.category}
//                 </p>
//                 <p>
//                   <b>Duration:</b> {course.courseDuration}
//                 </p>
//               </div>
//               {!submitted && (
//                 <div className="action-buttons">
//                   {!courseStatus.find((c) => c.id === course.courseId).accepted &&
//                     !courseStatus.find((c) => c.id === course.courseId).rejected && (
//                       <div>
//                         <Button
//                           className="accept-button"
//                           variant="outlined"
//                           startIcon={<CheckCircleOutlineIcon />}
//                           onClick={() => handleAccept(course.courseId)}
//                         >
//                           Accept
//                         </Button>
//                         <Button
//                           className="reject-button"
//                           variant="outlined"
//                           startIcon={<HighlightOffIcon />}
//                           onClick={() => handleReject(course.courseId)}
//                         >
//                           Reject
//                         </Button>
//                         {/* <button onClick={() => handleAccept(course.courseId)} className="accept-button">
//                           Accept
//                         </button> */}
//                         {/* <button onClick={() => handleReject(course.courseId)} className="reject-button">
//                           Reject
//                         </button> */}
//                       </div>
//                     )}
//                   {courseStatus.find((c) => c.id === course.courseId).accepted && <p className="status accepted">Accepted</p>}
//                   {courseStatus.find((c) => c.id === course.courseId).rejected && <p className="status rejected">Rejected</p>}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       {!submitted && (
//         <button
//           onClick={handleSubmit}
//           className="submit-button"
//           disabled={courseStatus.some((course) => !course.accepted && !course.rejected)}
//         >
//           Submit
//         </button>
//       )}
//       {submitted && <p>Submitted</p>}
//     </div>
//   );
// };
=======
    const handleToggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="request-card">
            <h3 onClick={handleToggleCollapse} style={{ display: 'flex', alignItems: 'center' }}>
                {employeeName} {collapsed ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
            </h3>
            {!collapsed && (
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.courseId} className={`course-row ${courseStatus.find(c => c.id === course.courseId).accepted || courseStatus.find(c => c.id === course.courseId).rejected ? 'greyed-out' : ''}`}>
                                <td>{course.courseName}</td>
                                <td>{course.category}</td>
                                <td>{course.courseDuration}</td>
                                <td>
                                    {!courseStatus.find(c => c.id === course.courseId).accepted && !courseStatus.find(c => c.id === course.courseId).rejected && (
                                        <>
                                            <button onClick={() => handleAccept(course.courseId)} className="accept-button">Accept</button>
                                            <button onClick={() => handleReject(course.courseId)} className="reject-button">Reject</button>
                                        </>
                                    )}
                                    {courseStatus.find(c => c.id === course.courseId).accepted && <p className="status accepted">Accepted</p>}
                                    {courseStatus.find(c => c.id === course.courseId).rejected && <p className="status rejected">Rejected</p>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
>>>>>>> Stashed changes

// export default RequestCard;
