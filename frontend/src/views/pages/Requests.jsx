import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const Requests = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  //   const [allCourses, setAllCourses] = useState([]);

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'MANAGER')) navigate('/login');

    const getRequests = async () => {
      try {
        const { data: nominations } = await axios.get(`/nomination?managerId=${auth?.user?.empId}`);
        const { data: courses } = await axios.get('/course');

        const filteredNominations = nominations.filter((nomination) => {
          return nomination.nominatedCourses.some((course) => course.approvalStatus === 'PENDING');
        });

        // Create a map of courses using courseId as the key
        const courseMap = new Map(courses.map((course) => [course.courseId, course]));

        // Iterate over nominations and add course details
        filteredNominations.forEach((nomination) => {
          nomination.nominatedCourses.forEach((nominatedCourse) => {
            const courseId = nominatedCourse.courseId;
            const courseDetails = courseMap.get(courseId);
            if (courseDetails) {
              // Add course details to nominatedCourse object
              nominatedCourse.courseName = courseDetails.courseName;
              nominatedCourse.duration = courseDetails.duration;
              nominatedCourse.domain = courseDetails.domain;
            }
          });
        });
        setRequests(filteredNominations);
      } catch (error) {
        console.log(error);
      }
    };
    getRequests();
  }, []);

  const handleRemoveCard = (employeeId) => {
    setCards(cards.filter((card) => card.id !== employeeId));
  };

  const handleAcceptReject = async (nominationId, courseId, action) => {
    try {
      const res = await axios.post(`/nomination/${action}?nominationId=${nominationId}&courseId=${courseId}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="requests">
      <h2>Pending Requests</h2>

      {requests?.map((card) => (
        <RequestCard
          key={card?.nominationId}
          employeeName={card?.empName}
          nominations={card?.nominatedCourses}
          onRemove={() => handleRemoveCard(card.id)}
          onAccept={(courseId) => handleAcceptReject(card?.nominationId, courseId, 'approve')}
          onReject={(courseId) => handleAcceptReject(card?.nominationId, courseId, 'reject')}
        />
      ))}
    </div>
  );
};

export default Requests;
