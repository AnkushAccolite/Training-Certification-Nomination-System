import React, { useState } from 'react';
import './RequestCard.css';
import IconButton from '@mui/material/IconButton';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const RequestCard = ({ employeeName, courses = [], onAccept, onReject }) => {
    const [courseStatus, setCourseStatus] = useState(courses.map(course => ({ id: course.courseId, accepted: false, rejected: false })));
    const [collapsed, setCollapsed] = useState(true);

    const handleAccept = (courseId) => {
        setCourseStatus(courseStatus.map(course => course.id === courseId ? { ...course, accepted: true, rejected: false } : course));
    };

    const handleReject = (courseId) => {
        setCourseStatus(courseStatus.map(course => course.id === courseId ? { ...course, accepted: false, rejected: true } : course));
    };

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

export default RequestCard;
