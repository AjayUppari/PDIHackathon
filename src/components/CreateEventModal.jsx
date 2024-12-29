import { useContext, useState } from 'react'
import { Dialog } from '@headlessui/react'
import StepOne from './event-creation/StepOne'
import StepTwo from './event-creation/StepTwo'
import StepThree from './event-creation/StepThree'
import StepFour from './event-creation/StepFour'
import ModalContext from '../context/TimelineContext'

function CreateEventModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1)
  const { eventData, setEventData} = useContext(ModalContext)

  const steps = [
    { id: 1, name: 'Create Event' },
    { id: 2, name: 'Add Problem Statements' },
    { id: 3, name: 'Define dates' },
    { id: 4, name: 'Publish' }
  ]

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e) => {
    // Here call API for publishing the event
    e.preventDefault();
    const formData = new FormData();

    const nowDateAndTime = new Date().toISOString()
    const { userId } = JSON.parse(localStorage.getItem('userData'))

    const updatedEventData = {...eventData, lastDateModified: nowDateAndTime, userId, isPublished: 'true'}

    console.log(updatedEventData)

    formData.append("eventData", JSON.stringify(updatedEventData)); // Append event data as JSON
    formData.append("file", eventData.poster);

    console.log('Final event data:', eventData)

    if(eventData.name === "") {
      alert('Event name mandatory')
    }
    else{
      const response= await fetch("http://localhost:5000/saveAndPublishEvent", {
        method: "POST",
        body: formData,
      })

      const data= await response.json();
      console.log(data)
  }
    setEventData(updatedEventData)
    onClose()
    setCurrentStep(1)
  }

  const handleSaveAsDraft = async (e) => {
    // Here call API for saving the draft

    e.preventDefault();
    const formData = new FormData();

    const nowDateAndTime = new Date().toISOString()
    const { userId } = JSON.parse(localStorage.getItem('userData'))

    const updatedEventData = {...eventData, lastDateModified: nowDateAndTime, userId, isPublished: 'false'}

    formData.append("eventData", JSON.stringify(updatedEventData)); // Append event data as JSON
    formData.append("file", eventData.poster);

    console.log('Final event data:', eventData)

    if(eventData.name === "") {
      alert('Event name mandatory')
    }
    else{
      const response= await fetch("http://localhost:5000/saveAndPublishEvent", {
        method: "POST",
        body: formData,
      })

      const data= await response.json();
      console.log(data)
  }

    setEventData(updatedEventData)
    
    onClose()
    setCurrentStep(1)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg">
          <div className="p-6">
            <div className="mb-8">
              <nav aria-label="Progress">
                <ol className="flex items-center justify-between">
                  {steps.map((step, stepIdx) => (
                    <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                      <div className="flex items-center">
                        <div
                          className={`${
                            currentStep >= step.id
                              ? 'bg-[#1226AA]'
                              : 'bg-gray-200'
                          } h-8 w-8 rounded-full flex items-center justify-center`}
                        >
                          <span className="text-white">{step.id}</span>
                        </div>
                        <span className="ml-4 text-sm font-medium">{step.name}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div className="mt-6">
              {currentStep === 1 && (
                <StepOne 
                  eventData={eventData} 
                  setEventData={setEventData} 
                />
              )}
              {currentStep === 2 && (
                <StepTwo 
                  eventData={eventData} 
                  setEventData={setEventData} 
                />
              )}
              {currentStep === 3 && (
                <StepThree 
                  eventData={eventData} 
                  setEventData={setEventData} 
                />
              )}
              {currentStep === 4 && (
                <StepFour eventData={eventData} setEventData={setEventData}  />
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Back
              </button>
              <div className="space-x-3">
                {currentStep === 4 && (
                  <button
                    onClick={handleSaveAsDraft}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Save as Draft
                  </button>
                )}
                {currentStep === 4 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[#00D2F4] text-white rounded hover:bg-[#1226AA]"
                  >
                    Publish Event
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-[#00D2F4] text-white rounded hover:bg-[#1226AA]"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default CreateEventModal