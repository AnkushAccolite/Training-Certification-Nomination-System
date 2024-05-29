import React, { useEffect, useState } from 'react';
import CertificationCard from './CertificationCard';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

const CertificationApplicationRequests = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  const fetchData = async () => {
    try {
      const { data: pendingRequests } = await axios.get(`/employee/pending-certifications?managerId=${auth?.user?.empId}`);

      const temp = pendingRequests?.map((request) => ({
        empId: request?.empId,
        employeeName: request?.empName,
        certifications: request?.pendingCertDetails?.map((cert) => ({
          certificationId: cert?.certificationId,
          certificationName: cert?.name,
          category: cert?.domain
        }))
      }));

      setRequests(temp);
      console.log(temp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!(auth?.isAuthenticated && auth?.user?.role === 'MANAGER')) navigate('/login');
    fetchData();
  }, [auth, navigate]);

  const handleAccept = async (empId, certificationId) => {
    console.log(empId);
    try {
      const res = await axios.get(`/certifications/approveCertification?empId=${empId}&certificationId=${certificationId}`);
      fetchData();
      toast.success('Certification Approved');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handleReject = async (empId, certificationId) => {
    try {
      const res = await axios.get(`/certifications/cancel?empId=${empId}&certificationId=${certificationId}`);
      fetchData();
      toast.success('Certification Rejected');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="requests">
      {requests?.length === 0 ? (
        <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <h2>No Pending Requests</h2>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default CertificationApplicationRequests;
