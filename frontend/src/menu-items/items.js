import { IconArrowRight, IconBook, IconBook2 ,IconCertificate,IconFileCertificate,IconFileDescription,IconClipboardText,IconMessages} from '@tabler/icons-react';
const icons = { IconArrowRight, IconBook, IconBook2 ,IconCertificate,IconFileCertificate,IconFileDescription,IconClipboardText,IconMessages };
const items = {
  id: 'items',
  type: 'group',
  children: [
    {
      id: 'courses',
      title: 'Courses',
      type: 'collapse',
      icon: icons.IconBook2,
      roles: ['ADMIN', 'USER', 'MANAGER'],
      children: [
        {
          id: 'all-courses',
          title: 'All Courses',
          type: 'item',
          url: '/all-courses',
          roles: ['ADMIN'],
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'monthly-courses',
          title: 'Monthly Courses',
          type: 'item',
          url: '/monthly-courses',
          roles: ['ADMIN'],
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'courses-list',
          title: 'Available Courses',
          type: 'item',
          url: '/courses',
          roles: ['ADMIN', 'USER', 'MANAGER'],
          icon: icons.IconBook,
          breadcrumbs: false
        },
        {
          id: 'courses-completed',
          title: 'Courses Completed',
          type: 'item',
          url: '/courses-completed',
          roles: ['ADMIN', 'USER', 'MANAGER'],
          icon: icons.IconBook,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'certifications',
      title: 'Certifications',
      type: 'collapse',
      icon: icons.IconCertificate,
      roles: ['ADMIN', 'USER', 'MANAGER'],
      children: [
        {
          id: 'certification-list',
          title: 'Available Courses for certification',
          type: 'item',
          url: '/certifications',
          icon: icons.IconFileCertificate,
          roles: ['ADMIN', 'USER', 'MANAGER'],
          breadcrumbs: false
        },
        {
          id: 'certifications-completed',
          title: 'Certifications Completed',
          type: 'item',
          url: '/certifications-completed',
          roles: ['ADMIN', 'USER', 'MANAGER'],
          icon: icons.IconFileCertificate,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'collapse',
      icon: icons.IconFileDescription,
      roles: ['ADMIN'],
      children: [
        {
          id: 'employee-report',
          title: 'Employee Report',
          type: 'item',
          url: '/employee-report',
          roles: ['ADMIN'],
          icon: icons.IconClipboardText,
          breadcrumbs: false
        },
        {
          id: 'course-report',
          title: 'Course Report',
          type: 'item',
          url: '/course-report',
          roles: ['ADMIN'],
          icon: icons.IconClipboardText,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'pending-requests',
      title: 'Requests',
      type: 'item',
      url: '/pending-requests',
      roles: ['MANAGER'],
      icon: icons.IconMessages,
      breadcrumbs: false
    }
  ]
};
export default items;