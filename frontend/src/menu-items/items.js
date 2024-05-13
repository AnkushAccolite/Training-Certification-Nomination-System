import { IconArrowRight, IconBook, IconBookOff } from '@tabler/icons-react';

const icons = { IconArrowRight, IconBook, IconBookOff };

const items = {
  id: 'items',
  type: 'group',
  children: [
    
    {
      id: 'courses',
      title: 'Courses',
      type: 'collapse',
      icon: icons.IconBookOff,
      children: [
        {
          id: 'all-courses',
          title: 'All Courses',
          type: 'item',
          url: '/all-courses',
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'monthly-courses',
          title: 'Monthly Courses',
          type: 'item',
          url: '/monthly-courses',
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'courses-list',
          title: 'Available Courses',
          type: 'item',
          url: '/courses',
          icon: icons.IconBook,
          breadcrumbs: false
        },
        // {
        //   id: 'assigned-courses',
        //   title: 'Assigned Courses',
        //   type: 'item',
        //   url: '/assigned-courses',
        //   icon: icons.IconBook,
        //   breadcrumbs: false
        // },
        {
          id: 'courses-completed',
          title: 'Courses Completed',
          type: 'item',
          url: '/courses-completed',
          icon: icons.IconBook,
          breadcrumbs: false
        }
      ],
    },
    
    // {
    //   id: 'status',
    //   title: 'Status',
    //   type: 'item',
    //   url: '/status',
    //   icon: icons.IconBookOff,
    //   breadcrumbs: false
    // },
    {
      id: 'certifications',
      title: 'Certifications',
      type: 'collapse',
      icon: icons.IconBookOff,
      children: [
        {
          id: 'certification-list',
          title: 'Available Courses for certification',
          type: 'item',
          url: '/certifications',
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'certifications-completed',
          title: 'Certifications Completed',
          type: 'item',
          url: '/certifications-completed',
          icon: icons.IconBook,
          breadcrumbs: false
        }
      ],
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: icons.IconBookOff,
      children: [
        {
          id: 'employee-report',
          title: 'Employee Report',
          type: 'item',
          url: '/employee-report',
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'course-report',
          title: 'Course Report',
          type: 'item',
          url: '/course-report',
          icon: icons.IconBook,
          breadcrumbs: false
        }
      ],
    },
    {
      id: 'pending-requests',
      title: 'Requests',
      type: 'item',
      url: '/pending-requests',
      icon: icons.IconBookOff,
      breadcrumbs: false
    },
    // {
    //   id: 'monthly-courses',
    //   title: 'Monthly Courses',
    //   type: 'item',
    //   url: '/monthly-courses',
    //   icon: icons.IconBookOff,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'employee-report',
    //   title: 'Employee Report',
    //   type: 'item',
    //   url: '/employee-report',
    //   icon: icons.IconBookOff,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'all-courses',
    //   title: 'All Courses',
    //   type: 'item',
    //   url: '/all-courses',
    //   icon: icons.IconBookOff,
    //   breadcrumbs: false
    // }
    // {
    //   id: 'course-report',
    //   title: 'Course Report',
    //   type: 'item',
    //   url: '/course-report',
    //   icon: icons.IconBookOff,
    //   breadcrumbs: false
    // }
  ]
};

export default items;
