import { format } from 'date-fns'

function StepFour({ eventData, setEventData }) {

  const handlePrizeChange = (position, value) => {
    console.log('eventData of prizes is ', eventData)
    setEventData({
      ...eventData,
      prizes: {
        ...eventData.prizes,
        [position]: value
      }
    })
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Prizes</h3>
          <div className="space-y-4">
            {['first', 'second', 'third'].map((position, index) => (
              <div key={position}>
                <label className="block text-sm font-medium text-gray-700">
                  {index + 1} Prize
                </label>
                <input
                  type="text"
                  value={eventData.prizes[position]}
                  onChange={(e) => handlePrizeChange(position, e.target.value)}
                  className="mt-1 border-gray-300 border-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Enter ${index + 1}st prize details`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Event Summary</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Event Name:</span> {eventData.name}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Problem Statements:</span> {eventData.problemStatements.length}
            </p>
          </div>
          <div className="prose prose-sm max-w-none mt-4" dangerouslySetInnerHTML={{ __html: eventData.rules }} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
          {Object.entries(eventData.dates).map(([key, date], index) => (
            <div key={key} className="relative pl-6">
              <span className="absolute left-0 -translate-x-1/2 w-3 h-3 bg-indigo-600 rounded-full" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
                <p className="text-gray-500">
                  {date ? format(new Date(date), 'PPP p') : 'Date not set'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepFour