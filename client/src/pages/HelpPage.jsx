import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const helpTopics = [
  {
    title: 'Getting Started',
    description: 'Learn how to set up your account and start exploring insights.',
    faqs: [
      { question: 'How do I set up my DSIQ account?', answer: 'Go to your profile settings and fill out the required information.' },
      { question: 'What is the DSIQ dashboard?', answer: 'Its your central hub for viewing and analyzing business insights.' },
    ],
  },
  {
    title: 'Connecting Data Sources',
    description: 'Integrate external systems to power your dashboards.',
    faqs: [
      { question: 'How do I connect a data source?', answer: 'Navigate to Settings > Data Sources, then click "Connect New Source".' },
      { question: 'What formats are supported?', answer: 'We support CSV, JSON, Google Sheets, and APIs.' },
    ],
  },
  {
    title: 'Generating Insights',
    description: 'Use your data to uncover trends and KPIs.',
    faqs: [
      { question: 'How are insights generated?', answer: 'You can create insights from dashboards or use the Insights Generator tool.' },
      { question: 'Can I share insights?', answer: 'Yes, insights can be exported or shared via link.' },
    ],
  },
  {
    title: 'Managing Users',
    description: 'Control access and permissions across your organization.',
    faqs: [
      { question: 'How do I invite a new user?', answer: 'Go to Team Management > Invite User and select their role.' },
      { question: 'What are the roles in DSIQ?', answer: 'Admin, Analyst, and Viewer with varying permissions.' },
    ],
  },
  {
    title: 'Troubleshooting',
    description: 'Solve common issues and contact support.',
    faqs: [
      { question: 'Why is my data not showing?', answer: 'Check your source sync status and filters on the dashboard.' },
      { question: 'How do I contact support?', answer: 'Click the "Generate Ticket" button below or email support@dsiq.io' },
    ],
  },
];

// Priority options for ticket
const priorityOptions = [
  { value: 'low', label: 'Low - Not urgent' },
  { value: 'medium', label: 'Medium - Important but can wait' },
  { value: 'high', label: 'High - Urgent issue' },
  { value: 'critical', label: 'Critical - System outage or blocking issue' },
];

// Category options for ticket
const categoryOptions = [
  { value: 'account', label: 'Account Issues' },
  { value: 'data', label: 'Data Connection Problems' },
  { value: 'dashboard', label: 'Dashboard Functionality' },
  { value: 'insights', label: 'Insight Generation' },
  { value: 'billing', label: 'Billing Questions' },
  { value: 'other', label: 'Other' },
];

const HelpPage = () => {
  const navigate = useNavigate();
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  
  // Ticket form state
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'dashboard',
    priority: 'medium',
    email: '',
  });

  const handleGoBack = () => {
    navigate(-1)
  };

  const handleClick = () => {
    navigate('/')
  };

  const openTicketModal = () => {
    setTicketModalOpen(true);
    setTicketSubmitted(false);
  };

  const closeTicketModal = () => {
    setTicketModalOpen(false);
    // Reset form if modal is closed
    if (!ticketSubmitted) {
      setFormData({
        subject: '',
        description: '',
        category: 'dashboard',
        priority: 'medium',
        email: '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    
    // Simulate ticket submission
    // In a real application, this would be an API call
    console.log('Submitting ticket:', formData);
    
    // Generate a random ticket number for demonstration
    const randomTicketNum = 'DSQ-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(randomTicketNum);
    setTicketSubmitted(true);
    
    // In a real application, you would reset the form after successful API response
    setTimeout(() => {
      setFormData({
        subject: '',
        description: '',
        category: 'dashboard',
        priority: 'medium',
        email: '',
      });
    }, 500);
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4 md:mb-0"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-4 md:mb-0">
          <HelpCircle size={28} /> Help &amp; Support
        </h1>
        <button
          onClick={handleClick}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Go to Dashboard</span>
        </button>
      </div>

      <div className="space-y-6">
        {helpTopics.map((topic, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-1">{topic.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{topic.description}</p>

            <div className="space-y-2">
              {topic.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border-b border-gray-700 py-2 cursor-pointer"
                >
                  <summary className="flex items-center justify-between text-gray-200 font-medium">
                    {faq.question}
                    <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-gray-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="mb-2 text-gray-300">Still need help?</p>
        <button 
          onClick={openTicketModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Generate Ticket
        </button>
      </div>

      {/* Ticket Generation Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md relative">
            <button 
              onClick={closeTicketModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            
            {!ticketSubmitted ? (
              <>
                <div className="p-6 border-b border-gray-700">
                  <h2 className="text-xl font-semibold text-white">Create Support Ticket</h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Describe your issue and we'll get back to you as soon as possible.
                  </p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Brief description of your issue"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          {categoryOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        >
                          {priorityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="4"
                        placeholder="Please provide as much detail as possible"
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                      ></textarea>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleSubmitTicket}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                      >
                        Submit Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Ticket Created Successfully</h2>
                <p className="text-gray-300 mb-2">
                  Your ticket has been submitted and we'll get back to you soon.
                </p>
                <p className="text-lg font-medium text-blue-400 mb-6">
                  Ticket #: {ticketNumber}
                </p>
                <button
                  onClick={closeTicketModal}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpPage;