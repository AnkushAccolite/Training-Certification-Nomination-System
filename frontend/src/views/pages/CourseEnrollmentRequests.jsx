import React, { useEffect, useState } from 'react';
import RequestCard from './RequestCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const CourseEnrollmentRequests = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  //   const [allCourses, setAllCourses] = useState([]);

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

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'MANAGER')) navigate('/login');
    getRequests();
  }, []);

  const handleRemoveCard = (employeeId) => {
    setCards(cards.filter((card) => card.id !== employeeId));
  };

  const handleAcceptReject = async (nominationId, courseId, action, month) => {
    try {
      const res = await axios.post(`/nomination/${action}?nominationId=${nominationId}&courseId=${courseId}&month=${month}`);
      getRequests();
      toast.success(`Successfully ${action}`);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="requests">
      {requests?.length !== 0 ? (
        <>
          <h2 style={{ paddingBottom: '20px', fontSize: '22px' ,textAlign:'center', marginBottom:'3px'}}>Pending Requests</h2>
          {requests?.map((card) => (
            <RequestCard
              key={card?.nominationId}
              employeeName={card?.empName}
              nominations={card?.nominatedCourses}
              onRemove={() => handleRemoveCard(card.id)}
              onAccept={(courseId) => handleAcceptReject(card?.nominationId, courseId, 'approve', card?.month)}
              onReject={(courseId) => handleAcceptReject(card?.nominationId, courseId, 'reject', card?.month)}
            />
          ))}
        </>
      ) : (
        <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>No Pending Requests</h2>
        </div>
      )}
    </div>
  );
};

export default CourseEnrollmentRequests;
