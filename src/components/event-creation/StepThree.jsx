import { format } from 'date-fns'

function StepThree({ eventData, setEventData }) {
  const dateFields = [
    { id: 'startRegistration', label: 'Start Registration' },
    { id: 'registrationEnd', label: 'Registration End' },
    { id: 'chooseProblem', label: 'Choose Problem' },
    { id: 'designSubmission', label: 'Design Submission' },
    { id: 'projectSubmission', label: 'Project Submission' },
    { id: 'reviewSubmissions', label: 'Reviewe submissions' },
    { id: 'results', label: 'Results' },
  ]

  const handleDateChange = (field, value) => {
    setEventData({
      ...eventData,
      dates: {
        ...eventData.dates,
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Define Important Dates</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {dateFields.map(({ id, label }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              type="datetime-local"
              id={id}
              value={eventData.dates[id]}
              onChange={(e) => handleDateChange(id, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepThree