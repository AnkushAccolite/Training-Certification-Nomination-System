import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const Certifications = () => {

  const navigate = useNavigate();
  const auth = useSelector(state=>state.auth);

  useEffect(() => {
    if(!(auth?.isAuthenticated))navigate("/login");
  }, []);
  return (
    <div>Certifications</div>
  )
}

export default Certifications