import React, { useState } from 'react';
import './RequestCard.css';

const RequestCard = ({ employeeName, courses = [], onAccept, onReject, onRemove }) => {
    const [courseStatus, setCourseStatus] = useState(courses.map(course => ({ id: course.courseId, accepted: false, rejected: false })));
    const [submitted, setSubmitted] = useState(false);
    const [showCourses, setShowCourses] = useState(false);

    const handleAccept = (courseId) => {
        setCourseStatus(courseStatus.map(course => course.id === courseId ? { ...course, accepted: true, rejected: false } : course));
    };

    const handleReject = (courseId) => {
        setCourseStatus(courseStatus.map(course => course.id === courseId ? { ...course, accepted: false, rejected: true } : course));
    };

    const handleSubmit = () => {
        const allCoursesReviewed = courseStatus.every(course => course.accepted || course.rejected);
        if (allCoursesReviewed) {
            setSubmitted(true);
            onRemove(); // Call onRemove to remove the card
        } else {
            alert('Please accept or reject all courses before submitting.');
        }
    };

    return (
        <div className="request-card">
            <h3 onClick={() => setShowCourses(!showCourses)} style={{ cursor: 'pointer' }}>
                {employeeName} {showCourses ? '▼' : '▶'}
            </h3>
            {showCourses && (
                <div>
                    {courses.map(course => (
                        <div key={course.courseId} className="course-container">
                            <div className="course-details">
                                <p><b>Course: {course.courseName}</b></p>
                                <p><b>Category:</b> {course.category}</p>
                                <p><b>Duration:</b> {course.courseDuration}</p>
                            </div>
                            {!submitted && (
                                <div className="action-buttons">
                                    {!courseStatus.find(c => c.id === course.courseId).accepted && !courseStatus.find(c => c.id === course.courseId).rejected && (
                                        <div>
                                            <button onClick={() => handleAccept(course.courseId)} className="accept-button">Accept</button>
                                            <button onClick={() => handleReject(course.courseId)} className="reject-button">Reject</button>
                                        </div>
                                    )}
                                    {courseStatus.find(c => c.id === course.courseId).accepted && <p className="status accepted">Accepted</p>}
                                    {courseStatus.find(c => c.id === course.courseId).rejected && <p className="status rejected">Rejected</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {!submitted && (
                <button onClick={handleSubmit} className="submit-button" disabled={courseStatus.some(course => !course.accepted && !course.rejected)}>
                    Submit
                </button>
            )}
            {submitted && <p>Submitted</p>}
        </div>
    );
};

export default RequestCard;
