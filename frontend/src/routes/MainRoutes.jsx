import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';


const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Courses = Loadable(lazy(() => import('views/pages/Courses')));
const Certifications = Loadable(lazy(() => import('views/pages/Certifications')));
const AssignedCourses = Loadable(lazy(() => import('views/pages/AssignedCourses')));
const Status = Loadable(lazy(() => import('views/pages/Status')));
const CoursesCompleted = Loadable(lazy(() => import('views/pages/CoursesCompleted')));
const CertificationsCompleted = Loadable(lazy(() => import('views/pages/CertificationsCompleted')));
const NominationForm = Loadable(lazy(() => import('views/pages/NominationForm')));
const MonthlyCourses = Loadable(lazy(() => import('views/pages/MonthlyCourses')));
// const AddCourse = Loadable(lazy(() => import('views/pages/AddCourse')));

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
          path: 'assigned-courses',
          element: <AssignedCourses />
        },
        {
          path: 'status',
          element: <Status />
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
          path: '/courses/nomination-form',
          element: <NominationForm />,
        },
        {
          path: '/monthly-courses',
          element: <MonthlyCourses />,
        }
        // {
        //   path: '/MonthlyCourses/add-course',
        //   element: <AddCourse />,
        // }
      ]
    }

  ]
};

export default MainRoutes;
