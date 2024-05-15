import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Requests = () => {

    const auth = useSelector(state=>state.auth);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!(auth?.isAuthenticated && auth?.user?.role==="MANAGER"))navigate("/login");
    },[])

    const [cards, setCards] = useState([
        { 
            id: 1, 
            employeeName: 'Employee 1', 
            courses: [
                { courseId: 1, courseName: 'Course A', category: 'Category X', courseDuration: '2 weeks', status: 'Pending' },
                { courseId: 2, courseName: 'Course B', category: 'Category Y', courseDuration: '3 weeks', status: 'Pending' }
            ]
        },
        { 
            id: 2, 
            employeeName: 'Employee 2', 
            courses: [
                { courseId: 3, courseName: 'Course C', category: 'Category Z', courseDuration: '4 weeks', status: 'Pending' }
            ]
        }
        // Add more initial card data as needed
    ]);

    const handleRemoveCard = (employeeId) => {
        setCards(cards.filter(card => card.id !== employeeId));
    };

    const handleAcceptReject = (employeeId, courseId, action) => {
        setCards(cards.map(card => {
            if (card.id === employeeId) {
                return {
                    ...card,
                    courses: card.courses.map(course => {
                        if (course.courseId === courseId) {
                            return { ...course, status: action === 'accept' ? 'Accepted' : 'Rejected' };
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
                    onAccept={(courseId) => handleAcceptReject(card.id, courseId, 'accept')}
                    onReject={(courseId) => handleAcceptReject(card.id, courseId, 'reject')}
                />
            ))}
        </div>
    );
};

export default Requests;
