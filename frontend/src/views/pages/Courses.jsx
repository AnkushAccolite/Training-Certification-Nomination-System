import React from 'react';
import { useNavigate } from "react-router-dom";

 const Courses = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/courses/nomination-form")
  };

  return (
    <button onClick={handleClick}>
      Go to Form Page
    </button>
  );
};

export default Courses
