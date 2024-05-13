// import React, { useState } from 'react';
// import Button from '@mui/material/Button';
// import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
// import Stack from '@mui/material/Stack';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import Checkbox from '@mui/material/Checkbox';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import RequestCard from './RequestCard';

// const Requests = () => {
//     const [cards, setCards] = useState([
//         {
//             id: 1,
//             employeeName: 'Employee 1',
//             courses: [
//                 { courseId: 1, courseName: 'Course A', category: 'Category X', courseDuration: '2 weeks', accepted: false },
//                 { courseId: 2, courseName: 'Course B', category: 'Category Y', courseDuration: '3 weeks', accepted: false }
//             ]
//         },
//         {
//             id: 2,
//             employeeName: 'Employee 2',
//             courses: [
//                 { courseId: 3, courseName: 'Course C', category: 'Category Z', courseDuration: '4 weeks', accepted: false }
//             ]
//         }
//         // Add more initial card data as needed
//     ]);

//     const handleRemoveCard = (employeeId) => {
//         setCards(cards.filter(card => card.id !== employeeId));
//     };

//     const handleAcceptCourse = (employeeId, courseId) => {
//         setCards(cards.map(card => {
//             if (card.id === employeeId) {
//                 return {
//                     ...card,
//                     courses: card.courses.map(course => {
//                         if (course.courseId === courseId) {
//                             return { ...course, accepted: true };
//                         }
//                         return course;
//                     })
//                 };
//             }
//             return card;
//         }));
//     };

//     const handleRejectCourse = (employeeId, courseId) => {
//         setCards(cards.map(card => {
//             if (card.id === employeeId) {
//                 return {
//                     ...card,
//                     courses: card.courses.map(course => {
//                         if (course.courseId === courseId) {
//                             return { ...course, accepted: false };
//                         }
//                         return course;
//                     })
//                 };
//             }
//             return card;
//         }));
//     };

//     return (
//         <div className="requests">

//             {cards.map(card => (
//                 <RequestCard
//                     key={card.id}
//                     employeeName={card.employeeName}
//                     courses={card.courses}
//                     onRemove={() => handleRemoveCard(card.id)}
//                     onAccept={(courseId) => handleAcceptCourse(card.id, courseId)}
//                     onReject={(courseId) => handleRejectCourse(card.id, courseId)}
//                 />
// //
//             ))}
//         </div>
//     );
// };

// export default Requests;

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './Requests.css';

const Requests = () => {
<<<<<<< Updated upstream
  const [courses, setCourses] = useState([
    { id: 1, courseName: 'React', domain: 'Web Development', duration: '4 weeks', accepted: false, rejected: false },
    { id: 2, courseName: 'Machine Learning', domain: 'Data Science', duration: '6 weeks', accepted: false, rejected: false }
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = (id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selectedIds.slice(0, selectedIndex), selectedIds.slice(selectedIndex + 1));
    }

    setSelectedIds(newSelected);
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  const handleAcceptReject = (action) => {
    const updatedCourses = courses.map((course) => {
      if (isSelected(course.id)) {
        return {
          ...course,
          accepted: action === 'accept',
          rejected: action === 'reject'
        };
      }
      return course;
    });
    setCourses(updatedCourses);
    setSelectedIds([]);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Domain</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id} className={course.accepted || course.rejected ? 'row-disabled' : ''}>
              <TableCell>
                <Checkbox
                  checked={isSelected(course.id)}
                  onChange={() => handleCheckboxChange(course.id)}
                  disabled={course.accepted || course.rejected}
=======
    const [cards, setCards] = useState([
        { 
            id: 1, 
            employeeName: 'Employee 1', 
            courses: [
                { courseId: 1, courseName: 'Course A', category: 'Category X', courseDuration: '2 weeks', accepted: false },
                { courseId: 2, courseName: 'Course B', category: 'Category Y', courseDuration: '3 weeks', accepted: false }
            ],
            closed: false // New property to track if card is closed
        },
        { 
            id: 2, 
            employeeName: 'Employee 2', 
            courses: [
                { courseId: 3, courseName: 'Course C', category: 'Category Z', courseDuration: '4 weeks', accepted: false }
            ],
            closed: false // New property to track if card is closed
        }
        // Add more initial card data as needed
    ]);

    const handleAcceptCourse = (employeeId, courseId) => {
        setCards(cards.map(card => {
            if (card.id === employeeId) {
                const updatedCourses = card.courses.map(course => {
                    if (course.courseId === courseId) {
                        return { ...course, accepted: true };
                    }
                    return course;
                });
                const allAccepted = updatedCourses.every(course => course.accepted);
                return { ...card, courses: updatedCourses, closed: allAccepted };
            }
            return card;
        }));
    };

    const handleRejectCourse = (employeeId, courseId) => {
        setCards(cards.map(card => {
            if (card.id === employeeId) {
                const updatedCourses = card.courses.map(course => {
                    if (course.courseId === courseId) {
                        return { ...course, accepted: false };
                    }
                    return course;
                });
                const allAccepted = updatedCourses.every(course => course.accepted);
                return { ...card, courses: updatedCourses, closed: allAccepted };
            }
            return card;
        }));
    };

    return (
        <div className="requests">
            <h2>Pending Requests</h2>
            
            {cards.map(card => (
                <RequestCard
                    key={card.id}
                    employeeName={card.employeeName}
                    courses={card.courses}
                    closed={card.closed}
                    onAccept={(courseId) => handleAcceptCourse(card.id, courseId)}
                    onReject={(courseId) => handleRejectCourse(card.id, courseId)}
>>>>>>> Stashed changes
                />
              </TableCell>
              <TableCell>{course.courseName}</TableCell>
              <TableCell>{course.domain}</TableCell>
              <TableCell>{course.duration}</TableCell>
              <TableCell>
                <Button
                  className="accept-button"
                  disabled={!isSelected(course.id) || course.accepted || course.rejected}
                  onClick={() => handleAcceptReject('accept')}
                  variant="outlined"
                  startIcon={<CheckCircleOutlineIcon />}
                >
                  Accept
                </Button>
                <Button
                  className="reject-button"
                  disabled={!isSelected(course.id) || course.accepted || course.rejected}
                  onClick={() => handleAcceptReject('reject')}
                  variant="outlined"
                  startIcon={<HighlightOffIcon />}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Requests;
