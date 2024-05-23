import React from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

const faqs = [
  {
    question: 'How can I reach out to the L&D Team?',
    answer: 'To reach the L&D Team please drop an email to ld@accolitedigital.com.'
  },
  {
    question: 'How can I access available trainings?',
    answer: 'Every month a training calendar is prepared and shared with all India employees from mylearning@accolitedigital.com, request you to please check that mail and nominate yourself for the training.'
  },
  {
    question: 'I have missed nominating myself for a previous training. How can I access it now?',
    answer: 'Kindly drop an email to ld@accolitedigital.com along with the names of all the trainings that you want to nominate.'
  },
  {
    question: 'Where can I check all the available trainings?',
    answer: 'Connect with the L&D Team through ld@accolitedigital.com and they shall be getting back to you on all the available training.'
  },
  {
    question: 'Who are the points of contact from the L&D team and how can I reach them?',
    answer: 'The points of contact from the L&D team are Anil Talluri and Avirup Chaterjee, you can reach them via email or slack. Their email IDs are anil.talluri@accolitedigital.com and avirup.chaterjee@accolitedigital.com.'
  },
  {
    question: 'What is the criteria to avail the trainings?',
    answer: 'You need to get an email approval from your Reporting Manager before you avail the trainings.'
  },
  {
    question: 'What is the medium for the trainings?',
    answer: 'Most trainings unless specified are self-paced virtual trainings which you can access through Eduthrill. An invite will be shared to you from which you can access the trainings.'
  },
  {
    question: 'Who should I reach out to in case of any issue in the Eduthrill portal?',
    answer: 'For any issue with Eduthrill portal please drop an email to ld@accolitedigital.com along with the screenshot of the issue.'
  }
];

const CustomExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  color: 'skyblue'
}));

function CourseFAQ() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (

    <div style={{ padding: '8px' }}>
      <h2 style={{ textAlign: 'center', paddingBottom:'6px' }}>Course FAQ's</h2>
      {faqs.map((faq, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          sx={{
            marginBottom: '15px',
            boxShadow: '0px 4px 8px #cfcdcc',
            borderRadius: '5px',
            '&:before': {
              display: 'none'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<CustomExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
            sx={{
              borderRadius: '10px 10px 0 0',
              '& .MuiAccordionSummary-content': {
                margin: 0
              }
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1.00rem' }}>{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: '#fffffc', padding: '20px', borderRadius: '0 0 10px 10px' }}>
            <Typography sx={{ fontSize: '0.98rem', fontStyle: 'initial' }}>
              {faq.answer.split('\n').map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default CourseFAQ;
