import ButtonBase from '@mui/material/ButtonBase';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import getAllCourses from 'utils/getAllCourses';
import Tooltip from '@mui/material/Tooltip';
import getNominationCourses from 'utils/getNominationCourses';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { IconBell } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';

const NotificationSection = () => {

  const theme = useTheme();
  const auth = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#32CD32');
  const [diffDays, setDiffDays] = useState(0);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);
  const [yetToStartCourses, setYetToStartCourses] = useState([]);

  const fetchData = async () => {
    try {
      const nominationCourses = await getNominationCourses(auth?.user?.empId);
      const approvedCourseIds = nominationCourses?.approvedCourses?.map((course) => course.courseId);
      const completedCourseIds = nominationCourses?.completedCourses?.map((course) => course.courseId);

      const allCourses = await getAllCourses();

      const yetToStartCourses = allCourses.filter((course) => !completedCourseIds?.includes(course.courseId) && approvedCourseIds?.includes(course.courseId));
      setYetToStartCourses(yetToStartCourses);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    const currentDate = new Date();    
   
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysRemaining = Math.ceil((endOfMonth - currentDate) / (1000 * 60 * 60 * 24));

    setDiffDays(daysRemaining);

    if (yetToStartCourses.length === 0) {
      setBackgroundColor('#32CD32');
    } else {
      if (daysRemaining <= 10 && daysRemaining > 5) {
        setBackgroundColor('#f5d505');
      } else if (daysRemaining <= 5) {
        setBackgroundColor('#e84023');
      } else {
        setBackgroundColor('#32CD32');
      }
    }
  }, [yetToStartCourses]);

  const handleToggle = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Check Status" placement="left">
        <ButtonBase sx={{ borderRadius: '50%' }} onClick={handleToggle}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              backgroundColor: backgroundColor,
              width: 40,
              height: 40,
              borderRadius: '50%',
              marginRight: '10px',
              color: backgroundColor === '#32CD32' ? '#000000' : backgroundColor,
              '&[aria-controls="menu-list-grow"], &:hover': {
                backgroundColor: backgroundColor === '#32CD32' ? '#2db32d' :
                  backgroundColor === '#f5d505' ? '#dec521' :
                    backgroundColor === '#e84023' ? '#c4341b' :
                      backgroundColor,
                transition: 'background-color 0.2s ease-in-out',
              },

              '& .custom-bell-icon path': {
                stroke: 'white !important',
              },
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          >
            <IconBell size="1.3rem" className="custom-bell-icon" />
          </Avatar>
        </ButtonBase>
      </Tooltip>

      <Modal open={open} onClose={handleClose}>
        {yetToStartCourses.length === 0 ? (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '50px',
            outline: 'none',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '400px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="h5" gutterBottom>
              <b>Congrats!🎉</b>
            </Typography>
            <Typography variant="h5" gutterBottom>
              You're all set. You have no incomplete courses.
            </Typography>
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '30px',
            outline: 'none',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '400px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}>
            {diffDays === 0 ? (
              <>
                <Typography variant="h4" gutterBottom style={{ marginBottom: '15px', textAlign: 'center', color: '#e84023' }}>
                  <b>Immediate Action Required</b>
                </Typography>
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
                  The following courses are due today:
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom style={{ marginBottom: '15px', textAlign: 'center' }}>
                  <b>Action Items</b>
                </Typography>
                <Typography variant="h5" gutterBottom style={{ textAlign: 'center' }}>
                  You have{' '}
                  <span style={{ color: backgroundColor === '#32CD32' ? '#32CD32' : backgroundColor === '#e84023' ? '#e84023' : backgroundColor === '#f5d505' ? '#f5d505' : '#000000' }}>
                    {diffDays} days
                  </span>{' '}
                  left to complete the following:
                </Typography>
              </>
            )}
            <ol>
              {yetToStartCourses.map((course, index) => (
                <li key={index}>{course.courseName}</li>
              ))}
            </ol>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NotificationSection;
