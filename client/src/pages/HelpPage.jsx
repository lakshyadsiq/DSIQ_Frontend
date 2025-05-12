import React from 'react';
import { HelpCircle, ChevronDown, ArrowLeft } from 'lucide-react';
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
      { question: 'How do I contact support?', answer: 'Click the "Contact Support" button below or email support@dsiq.io' },
    ],
  },
];

const HelpPage = () => {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="mb-6 flex space-x-170">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <HelpCircle size={28} /> Help & Support
      </h1>
      </div>

      <div className="space-y-6">
        {helpTopics.map((topic, index) => (
          <div key={index} className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-1">{topic.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{topic.description}</p>

            <div className="space-y-2">
              {topic.faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group border-b border-gray-300 dark:border-gray-700 py-2 cursor-pointer"
                >
                  <summary className="flex items-center justify-between text-gray-800 dark:text-gray-200 font-medium">
                    {faq.question}
                    <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="mb-2 text-gray-700 dark:text-gray-300">Still need help?</p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpPage;