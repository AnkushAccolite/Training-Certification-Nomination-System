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
          id: 'assigned-courses',
          title: 'Assigned Courses',
          type: 'item',
          url: '/assigned-courses',
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
        },
        {
          id: 'course-faq',
          title: 'Courses FAQ',
          type: 'item',
          url: '/course-faq',
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
        },
        {
          id: 'certification-assigned',
          title: 'Certifications Enrolled',
          type: 'item',
          url: '/certifications-assigned',
          icon: icons.IconFileCertificate,
          roles: ['ADMIN', 'USER', 'MANAGER'],
          breadcrumbs: false
        },
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
        },
        {
          id: 'certification-report',
          title: 'Certification Report',
          type: 'item',
          url: '/certification-report',
          roles: ['ADMIN'],
          icon: icons.IconClipboardText,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'Requests',
      title: 'Requests',
      type: 'collapse',
      icon: icons.IconFileDescription,
      roles: ['MANAGER'],
      children: [
        {
          id: 'course-request',
          title: 'Course Enrollment Requests',
          type: 'item',
          url: '/course-requests',
          roles: ['MANAGER'],
          icon: icons.IconClipboardText,
          breadcrumbs: false
        },
        {
          id: 'certification-request',
          title: 'Certification Application Requests',
          type: 'item',
          url: '/certification-request',
          roles: ['MANAGER'],
          icon: icons.IconClipboardText,
          breadcrumbs: false
        }
      ]
    }
  ]
};
export default items;