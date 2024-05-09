// CourseModal.js

import React from 'react';

const CourseModal = ({ course, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{course.coursename} Details</h2>
        <p>{course.description}</p>
      </div>
    </div>
  );
};

export default CourseModal;
