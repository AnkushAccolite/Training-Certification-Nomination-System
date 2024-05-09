// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBrandChrome, IconHelp };

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const items = {
  id: 'items',
  type: 'group',
  children: [
    {
      id: 'courses',
      title: 'Courses',
      type: 'item',
      url: '/courses',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'certifications',
      title: 'Certifications',
      type: 'item',
      url: '/certifications',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'assigned-courses',
      title: 'Assigned Courses',
      type: 'item',
      url: '/assigned-courses',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'status',
      title: 'Status',
      type: 'item',
      url: '/status',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'courses-completed',
      title: 'Courses Completed',
      type: 'item',
      url: '/courses-completed',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'certifications-completed',
      title: 'Certifications Completed',
      type: 'item',
      url: '/certifications-completed',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'pending-requests',
      title: 'Requests',
      type: 'item',
      url: '/pending-requests',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    },
    {
      id: 'all-courses',
      title: 'AllCourses',
      type: 'item',
      url: '/all-courses',
      icon: icons.IconBrandChrome,
      breadcrumbs: false
    }
    // {
    //   id: 'documentation',
    //   title: 'Documentation',
    //   type: 'item',
    //   url: 'https://codedthemes.gitbook.io/berry/',
    //   icon: icons.IconHelp,
    //   external: true,
    //   target: true
    // }
  ]
};

export default items;
