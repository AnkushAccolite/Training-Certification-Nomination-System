import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import EmployeeReport from 'views/pages/EmployeeReport';
import CourseReport from 'views/pages/CourseReport';
import CertificationsReport from 'views/pages/CertificationsReport';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

const Courses = Loadable(lazy(() => import('views/pages/Courses')));
const AllCourses = Loadable(lazy(() => import('views/pages/AllCourses')));
const AddCourse = Loadable(lazy(() => import('views/pages/AddCourse')));
const AssignedCourses = Loadable(lazy(() => import('views/pages/AssignedCourses')));
const CoursesCompleted = Loadable(lazy(() => import('views/pages/CoursesCompleted')));
const CourseEnrollmentRequests = Loadable(lazy(() => import('views/pages/CourseEnrollmentRequests')));
const MonthlyCourses = Loadable(lazy(() => import('views/pages/MonthlyCourses')));
const CoursesFaq = Loadable(lazy(() => import('views/pages/CourseFAQ')));

const Certifications = Loadable(lazy(() => import('views/pages/Certifications')));
const CertificationsCompleted = Loadable(lazy(() => import('views/pages/CertificationsCompleted')));
const CertificationsApproved = Loadable(lazy(() => import('views/pages/CertificationsApproved')));
// const CertificationFAQ = Loadable(lazy(() => import('views/pages/CertificationFAQ')));

const CourseEnrollmentRequests = Loadable(lazy(() => import('views/pages/CourseEnrollmentRequests')));
// const CourseEnrollmentRequests = Loadable(lazy(() => import('views/pages/CourseEnrollmentRequests')));
const CertificationApplicationRequests = Loadable(lazy(() => import('views/pages/CertificationApplicationRequests')));
const AllCourses = Loadable(lazy(() => import('views/pages/AllCourses')));
const AddCourse = Loadable(lazy(() => import('views/pages/AddCourse')));
// const AddCertification = Loadable(lazy(() => import('views/pages/AddCertification')));
const AddCertification = Loadable(lazy(() => import('views/pages/AddCertification')));
const CertificationsFaq = Loadable(lazy(() => import('views/pages/CertificationFAQ')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: '/',
      children: [
        {
          path: 'courses',
          element: <Courses />
        },
        {
          path: 'certifications',
          element: <Certifications />
        },
        {
          path: 'certifications/add-certifications',
          element: <AddCertification />
        },
        {
          path: 'assigned-courses',
          element: <AssignedCourses />
        },
        {
          path: 'courses-completed',
          element: <CoursesCompleted />
        },
        {
          path: 'certifications-completed',
          element: <CertificationsCompleted />
        },
        {
          path: 'course-requests',
          element: <CourseEnrollmentRequests />
        },
        {
          path: 'all-courses',
          element: <AllCourses />
        },
        {
          path: 'AllCourses/add-course',
          element: <AddCourse />
        },
        {
          path: '/monthly-courses',
          element: <MonthlyCourses />
        },
        {
          path: 'certification-request',
          element: <CertificationApplicationRequests />
        },
        {
          path: 'employee-report',
          element: <EmployeeReport />
        },
        {
          path: 'course-report',
          element: <CourseReport />
        },
        {
          path: 'course-faq',
          element: <CoursesFaq />
        },
        {
          path: 'certification-report',
          element: <CertificationsReport />
        },
        {
          path: 'certifications-approved',
          element: <CertificationsApproved />
        },
        {
          path: 'certifications-faq',
          element: <CertificationsFaq />
        }
      ]
    }
  ]
};

export default MainRoutes;
