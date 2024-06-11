import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import { toast } from 'react-hot-toast';


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
    answer: 'Kindly follow the below steps to apply for certification reimbursement.\n• Please get a pre-approval from your Reporting manager and Delivery Director\n• Once you have gotten the approval, please drop an email to ld@accolitedigital.com along with the pre-approval mail.\n• Once you have gone through the material, attempted the certification examination and successfully cleared it you can apply for reimbursement.\n• For reimbursement, please raise a request in expenses in swift. You may please attach bills, certification copy, approval mail from manager in that request.\n• Please use the below project number for the expenses claim as IN-10099.'
  },
  {
    question: 'What is the eligibility criteria to apply for a certification?',
    answer: 'You need to collect email approval from your Reporting Manager to ensure that you are eligible to apply for the certification. Accolite will reimburse the cost of the certification, provided only if first certification attempt is successful. Only for cloud & data certifications (Mentioned in Accolite Certification List), Accolite will reimburse your certification cost for a maximum of two attempts (If you pass the certification on your second attempt, you will be reimbursed for the cost of both attempts. However, if you fail the certification on your second attempt, you will not be reimbursed for either attempt).'
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
  const auth = useSelector((state) => state.auth);
  const [expanded, setExpanded] = React.useState(false);
  const [showEditFAQs, setShowEditFAQs] = React.useState(false);
  const [showAddFAQModal, setShowAddFAQModal] = React.useState(false);
  const [newFAQ, setNewFAQ] = React.useState({ question: '', answer: '' });
  const [faqItems, setFaqItems] = React.useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteIndex, setDeleteIndex] = React.useState(null);
  const [editIndex, setEditIndex] = React.useState(null);
  const [emptyFAQError, setEmptyFAQError] = React.useState(false);
  const [emptyEditError, setEmptyEditError] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  useEffect(() => {
    setFaqItems(faqs.map(faq => ({
      ...faq,
      showEditDelete: auth.isAuthenticated && auth.user.role === 'ADMIN' && showEditFAQs
    })));
  }, [showEditFAQs, auth.isAuthenticated, auth.user.role]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleToggleEditFAQs = () => {
    setShowEditFAQs(prevState => !prevState);
    setShowAddFAQModal(false);
  };

  const handleDeleteModalOpen = (index) => {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteFAQ = () => {
    console.log('Deleting FAQ at index', deleteIndex);
    const updatedFaqItems = faqItems.filter((faq, index) => index !== deleteIndex);
    setFaqItems(updatedFaqItems);
    handleDeleteModalClose();
  };

  const handleAddFAQ = () => {
    if (newFAQ.question.trim() === '' || newFAQ.answer.trim() === '') {
      setEmptyFAQError(true);
      toast.error("Question or Answer cannot be empty!");
    } else {
      setEmptyFAQError(false);
      setShowAddFAQModal(false);
      const updatedFaqItems = [...faqItems, { ...newFAQ, showEditDelete: true }];
      setNewFAQ({ question: '', answer: '' });
      setEditIndex(null);
      setFaqItems(updatedFaqItems);
      toast.success("FAQ Added Successfully!");
    }
  };

  const handleEditFAQ = (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = () => {
    if (faqItems[editIndex].question.trim() === '' || faqItems[editIndex].answer.trim() === '') {
      setEmptyEditError(true);
      toast.error("Question or Answer cannot be empty!");
    } else {
      setEmptyEditError(false);
      console.log('Saving edit for FAQ at index', editIndex);
      setEditIndex(null);
    }
  };
  

  return (
    <div style={{ padding: '8px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ textAlign: 'center', paddingBottom: '8px', flex: '1' }}>Certification FAQ's</h2>
        {auth?.isAuthenticated && auth?.user?.role === 'ADMIN' && (
          <Button
            style={{
              color: 'white',
              backgroundColor: '#3498DB',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '10px',
              marginRight: '8px',
            }}
            onClick={handleToggleEditFAQs}
          >
            {showEditFAQs ? 'Close Edit FAQs' : 'Edit FAQs'}
          </Button>
        )}
        {showEditFAQs && (
          <Button
            style={{
              color: 'white',
              backgroundColor: '#4CBB17',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
            onClick={() => setShowAddFAQModal(true)}
          >
            Add FAQ
          </Button>
        )}
      </div>
      {faqItems.map((faq, index) => (
        <React.Fragment key={index}>
          <Accordion
            expanded={editIndex === index || expanded === index}
            onChange={handleChange(index)}
            sx={{
              marginBottom: '8px',
              boxShadow: '0px 4px 8px #cfcdcc',
              borderRadius: '5px',
              '&:before': {
                display: 'none'
              },
              backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff'
            }}
          >
            <AccordionSummary
              expandIcon={<CustomExpandMoreIcon />}
              aria-controls={`panel${index + 1}-content`}
              id={`panel${index + 1}-header`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '10px 10px 0 0',
                '& .MuiAccordionSummary-content': {
                  margin: 0
                }
              }}
            >
              {editIndex !== index ? (
                <Typography variant="h6" sx={{ fontSize: '1.00rem', flex: 1 }}>{faq.question}</Typography>
              ) : (
                <TextField
                  id={`faq-question-${index}`}
                  label="Question"
                  variant="outlined"
                  fullWidth
                  value={faq.question}
                  onChange={(e) => {
                    const updatedFaqItems = [...faqItems];
                    updatedFaqItems[index].question = e.target.value;
                    setFaqItems(updatedFaqItems);
                  }}
                />
              )}
              {faq.showEditDelete && (
                <div style={{ display: 'flex' }}>
                  {editIndex !== index ? (
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditFAQ(index)}>
                        <EditIcon style={{ color: '#3498DB' }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Save">
                      <IconButton onClick={handleSaveEdit}>
                        <SaveIcon style={{ color: '#4CAF50' }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDeleteModalOpen(index)}>
                      <DeleteIcon style={{ color: '#E35335' }} />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </AccordionSummary>
            <AccordionDetails
              sx={{
                backgroundColor: index % 2 === 0 ? '#e0e0e0' : '#f2f2f2',
                padding: '20px',
                borderRadius: '0 0 10px 10px'
              }}
            >
              {editIndex !== index ? (
                <Typography sx={{ fontSize: '0.98rem', fontStyle: 'initial' }}>{faq.answer}</Typography>
              ) : (
                <TextField
                  id={`faq-answer-${index}`}
                  label="Answer"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={faq.answer}
                  onChange={(e) => {
                    const updatedFaqItems = [...faqItems];
                    updatedFaqItems[index].answer = e.target.value;
                    setFaqItems(updatedFaqItems);
                  }}
                />
              )}
            </AccordionDetails>
          </Accordion>
        </React.Fragment>
      ))}
      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            backgroundColor: 'white',
            borderRadius: 8,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            Deletion Confirmation
          </Typography>
          <Typography id="delete-modal-title" variant="h5" component="h2" sx={{ mb: 2 }}>
            Are you sure you want to delete the selected FAQ?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" color="error" sx={{ mr: 2 }} onClick={handleDeleteFAQ}>
              Yes
            </Button>
            <Button variant="contained" onClick={handleDeleteModalClose}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={showAddFAQModal}
        onClose={() => setShowAddFAQModal(false)}
        aria-labelledby="add-faq-modal-title"
        aria-describedby="add-faq-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            backgroundColor: 'white',
            borderRadius: 8,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="add-faq-modal-title" variant="h4" component="h2" sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            Add New FAQ
          </Typography>
          <TextField
            id="faq-question"
            label="Question"
            variant="outlined"
            fullWidth
            value={newFAQ.question}
            onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            id="faq-answer"
            label="Answer"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newFAQ.answer}
            onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              onClick={handleAddFAQ}
            >
              Add
            </Button>
            <Button variant="contained" onClick={() => setShowAddFAQModal(false)}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default CertificationFAQ;