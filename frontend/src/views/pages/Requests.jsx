import React, { useState } from 'react';
import RequestCard from './RequestCard';

const Requests = () => {
    const [cards, setCards] = useState([
        { 
            id: 1, 
            employeeName: 'Employee 1', 
            courses: [
                { courseId: 1, courseName: 'Course A', category: 'Category X', courseDuration: '2 weeks', accepted: false },
                { courseId: 2, courseName: 'Course B', category: 'Category Y', courseDuration: '3 weeks', accepted: false }
            ]
        },
        { 
            id: 2, 
            employeeName: 'Employee 2', 
            courses: [
                { courseId: 3, courseName: 'Course C', category: 'Category Z', courseDuration: '4 weeks', accepted: false }
            ]
        }
        // Add more initial card data as needed
    ]);

    const handleRemoveCard = (employeeId) => {
        setCards(cards.filter(card => card.id !== employeeId));
    };

    const handleAcceptCourse = (employeeId, courseId) => {
        setCards(cards.map(card => {
            if (card.id === employeeId) {
                return {
                    ...card,
                    courses: card.courses.map(course => {
                        if (course.courseId === courseId) {
                            return { ...course, accepted: true };
                        }
                        return course;
                    })
                };
            }
            return card;
        }));
    };

    const handleRejectCourse = (employeeId, courseId) => {
        setCards(cards.map(card => {
            if (card.id === employeeId) {
                return {
                    ...card,
                    courses: card.courses.map(course => {
                        if (course.courseId === courseId) {
                            return { ...course, accepted: false };
                        }
                        return course;
                    })
                };
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
                    onRemove={() => handleRemoveCard(card.id)}
                    onAccept={(courseId) => handleAcceptCourse(card.id, courseId)}
                    onReject={(courseId) => handleRejectCourse(card.id, courseId)}
                />
            ))}
        </div>
    );
};

export default Requests;