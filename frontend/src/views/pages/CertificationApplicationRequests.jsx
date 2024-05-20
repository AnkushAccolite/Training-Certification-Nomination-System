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

        // Dummy data for certification requests
        const dummyRequests = [
            {
                certificationId: 1,
                employeeName: 'John Doe',
                certifications: [
                    {
                        certificationId: 1, // Add certificationId
                        certificationName: 'AWS Certified Solutions Architect',
                        category: 'Cloud',
                        price: 150,
                        status: 'Pending', // Add status field
                    },
                    {
                        certificationId: 2, // Add certificationId
                        certificationName: 'AWS Certified Solutions ',
                        category: 'Cloud',
                        price: 200,
                        status: 'Pending', // Add status field
                    },
                ],
            },
            {
                certificationId: 2,
                employeeName: 'Jane Smith',
                certifications: [
                    {
                        certificationId: 3, // Add certificationId
                        certificationName: 'Certified Information Systems Security Professional (CISSP)',
                        category: 'Security',
                        price: 700,
                        status: 'Pending', // Add status field
                    },
                ],
            },
        ];

        setRequests(dummyRequests);
    }, []);

    const handleAccept = (certificationId) => {
        // Update status to 'Accepted' for the specific certification
        setRequests((prevRequests) => {
            return prevRequests.map((request) => {
                const updatedCertifications = request.certifications.map((certification) => {
                    if (certification.certificationId === certificationId) {
                        return { ...certification, status: 'Accepted' };
                    }
                    return certification;
                });
                return { ...request, certifications: updatedCertifications };
            });
        });
    };

    const handleReject = (certificationId) => {
        // Update status to 'Rejected' for the specific certification
        setRequests((prevRequests) => {
            return prevRequests.map((request) => {
                const updatedCertifications = request.certifications.map((certification) => {
                    if (certification.certificationId === certificationId) {
                        return { ...certification, status: 'Rejected' };
                    }
                    return certification;
                });
                return { ...request, certifications: updatedCertifications };
            });
        });
    };

    return (
        <div className="requests">
            <h2>Pending Certification Requests</h2>

            {requests?.map((card) => (
                <CertificationCard
                    key={card?.certificationId}
                    employeeName={card?.employeeName}
                    certifications={card?.certifications}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            ))}
        </div>
    );
};

export default CertificationApplicationRequests;
