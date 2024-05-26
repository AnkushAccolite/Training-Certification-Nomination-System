import React, { useEffect, useState } from 'react';
import CertificationCard from './CertificationCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const CertificationApplicationRequests = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'MANAGER')) navigate('/login');

    const fetchData = async () => {
      try {
        const { data: pendingRequests } = await axios.get(`/employee/pending-certifications?managerId=${auth?.user?.empId}`);

        const temp = pendingRequests?.map((request) => ({
          empId: request?.empId,
          employeeName: request?.empName,
          certifications: request?.pendingCertDetails?.map((cert) => ({
            certificationId: cert?.certificationId,
            certificationName: cert?.name,
            category: cert?.category
          }))
        }));

        setRequests(temp);
        console.log(temp);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [auth, navigate]);

  const handleAccept = async (empId, certificationId) => {
    console.log(empId);
    try {
      const res = await axios.get(`/certifications/approveCertification?empId=${empId}&certificationId=${certificationId}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (empId, certificationId) => {
    try {
      const res = await axios.get(`/certifications/cancel?empId=${empId}&certificationId=${certificationId}`);
      navigate(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="requests">
      <h2>Pending Certification Requests</h2>

      {requests?.map((card) => (
        <CertificationCard
          key={card?.certificationId}
          employeeName={card?.employeeName}
          certifications={card?.certifications}
          onAccept={(certId) => handleAccept(card?.empId, certId)}
          onReject={(certId) => handleReject(card?.empId, certId)}
        />
      ))}
    </div>
  );
};

export default CertificationApplicationRequests;
