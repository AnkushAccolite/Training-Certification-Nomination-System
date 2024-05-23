import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

const faqs = [
  {
    question: 'Is there any policy on certification reimbursements?',
    answer: 'Yes, we have a policy on certification reimbursement. Please refer to CERTIFICATION REIMBURSEMENT POLICY page.'
  },
  {
    question: 'What is the maximum amount I can claim for certification reimbursement?',
    answer: 'INR 25,000/- in a calendar year (Jan -Dec).'
  },
  {
    question: 'Is there any commitment I need to give if I claim for certification reimbursement?',
    answer: 'Yes, a lock in tenure with Accolite for 12 months from the date of reimbursement.'
  },
  {
    question: 'What are the Steps to apply for certification reimbursement?',
    answer:
      'Kindly follow the below steps to apply for certification reimbursement.\n• Please get a pre-approval from your Reporting manager and Delivery Director\n• Once you have gotten the approval, please drop an email to ld@accolitedigital.com along with the pre-approval mail.\n• Once you have gone through the material, attempted the certification examination and successfully cleared it you can apply for reimbursement.\n• For reimbursement, please raise a request in expenses in swift. You may please attach bills, certification copy, approval mail from manager in that request.\n• Please use the below project number for the expenses claim as IN-10099.'
  },
  {
    question: 'What is the eligibility criteria to apply for a certification?',
    answer:
      'You need to collect email approval from your Reporting Manager to ensure that you are eligible to apply for the certification. Accolite will reimburse the cost of the certification, provided only if first certification attempt is successful. Only for cloud & data certifications (Mentioned in Accolite Certification List), Accolite will reimburse your certification cost for a maximum of two attempts (If you pass the certification on your second attempt, you will be reimbursed for the cost of both attempts. However, if you fail the certification on your second attempt, you will not be reimbursed for either attempt).'
  },
  {
    question: 'Can I apply for certifications not listed in the approved certification list?',
    answer: 'Yes, you can apply after getting a mail approval from your reporting manager.'
  },
  {
    question: 'My allocated certification budget is consumed in a calendar year, am I still eligible to get reimbursement?',
    answer: 'Please reach to ld@accolitedigital.com to get details.'
  },
  {
    question: 'I am an Intern, am I eligible for certification reimbursement?',
    answer: 'Yes, please get a pre-approval from your manager and deliver director and share the details to ld@accolitedigital.com.'
  }
];

const CustomExpandMoreIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  color: 'skyblue'
}));

function CertificationFAQ() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div style={{ padding: '8px' }}>  
      <h2 style={{ textAlign: 'center', paddingBottom:'8px' }}>Certification FAQ's</h2>

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
            <Typography variant="h6" sx={{ fontSize: '1.00rem' }}>
              {faq.question}
            </Typography>
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

export default CertificationFAQ;
