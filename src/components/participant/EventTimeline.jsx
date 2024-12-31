import { useState } from 'react'
import ProjectSelectionModal from './forms/ProjectSelectionModal'
import DocumentSubmissionModal from './forms/DocumentSubmissionModal'
import ProjectSubmissionModal from './forms/ProjectSubmissionModal'
import RegistrationModal from './forms/RegistrationModal'

function EventTimeline({ timeline }) {
  const [activeModal, setActiveModal] = useState(null)

  const handleSubmit = (type, data) => {
    console.log(`Submitting ${type}:`, data)
    // Here you would typically make an API call to update the submission
    setActiveModal(null)
  }

  const getActionButton = (phase, status) => {
    if (status !== 'current') return null

    switch (phase) {
      case 'Registration':
        return (
          <button
            onClick={() => setActiveModal('registration')}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Register Now
          </button>
        )
      case 'Choose Project':
        return (
          <button
            onClick={() => setActiveModal('project')}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Choose Project
          </button>
        )
      case 'Document Submission':
        return (
          <button
            onClick={() => setActiveModal('document')}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Document
          </button>
        )
      case 'Project Submission':
        return (
          <button
            onClick={() => setActiveModal('project-submission')}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Submit Project
          </button>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="relative">
        <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={index} className="relative pl-10">
              <div 
                className={`absolute left-3.5 -translate-x-1/2 w-3 h-3 rounded-full border-2
                  ${item.status === 'completed' ? 'bg-green-500 border-green-500' :
                    item.status === 'current' ? 'bg-blue-500 border-blue-500' :
                    'bg-white border-gray-300'}`}
              />
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div>
                  <h4 className={`font-medium
                    ${item.status === 'completed' ? 'text-green-600' :
                      item.status === 'current' ? 'text-blue-600' :
                      'text-gray-500'}`}>
                    {item.phase}
                  </h4>
                  <p className="text-sm text-gray-500">{item.date}</p>
                  {getActionButton(item.phase, item.status)}
                </div>
                {item.status === 'current' && (
                  <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Current Phase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegistrationModal
        isOpen={activeModal === 'registration'}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => handleSubmit('registration', data)}
      />

      <ProjectSelectionModal
        isOpen={activeModal === 'project'}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => handleSubmit('project', data)}
      />

      <DocumentSubmissionModal
        isOpen={activeModal === 'document'}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => handleSubmit('document', data)}
      />

      <ProjectSubmissionModal
        isOpen={activeModal === 'project-submission'}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => handleSubmit('project-submission', data)}
      />
    </>
  )
}

export default EventTimeline