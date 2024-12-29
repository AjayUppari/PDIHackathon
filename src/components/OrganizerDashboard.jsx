import { useState } from 'react'
import { format } from 'date-fns'
import CreateEventModal from './CreateEventModal'
import ProblemStatementModal from './ProblemStatementModal'

const mockEvents = [
  {
    id: 1,
    name: 'Innovation Challenge 2024',
    startDate: '2024-04-15',
    endDate: '2024-04-17',
    status: 'future',
    participants: 0,
    teams: 0,
  },
  {
    id: 2,
    name: 'Code Sprint Q1',
    startDate: '2024-03-01',
    endDate: '2024-03-03',
    status: 'ongoing',
    participants: 45,
    teams: 12,
  },
  {
    id: 3,
    name: 'Tech Summit Hackathon',
    startDate: '2024-01-15',
    endDate: '2024-01-17',
    status: 'past',
    participants: 60,
    teams: 15,
  },
]

const phaseMapping = {
  registration: "Registration",
  organizerSubmission: "Project Submission by Organizer",
  teamLeadSelection: "Choose Project",
  documentSubmission: "Document Submission",
  projectSubmission: "Project Submission",
  reviewPhase: "Review Phase",
  results: "Results"
}

function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  
  const filteredEvents = activeTab === 'all' 
    ? mockEvents 
    : mockEvents.filter(event => event.status === activeTab)

  const handleProblemSubmit = (problems) => {
    console.log('New problem statements:', problems)
    setIsProblemModalOpen(false)
  }

  const timeline = Object.entries(timelineStatus).map(([key, status]) => ({
    phase: phaseMapping[key],
    status,
    key
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Hackathon Events</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-light transition-colors"
        >
          Create New Event
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Ongoing Event: Code Sprint Q1
        </h2>
        <div className="relative">
          <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={item.key} className="relative pl-10">
                <div 
                  className={`absolute left-3.5 -translate-x-1/2 w-3 h-3 rounded-full border-2
                    ${item.status === 'completed' ? 'bg-secondary border-secondary' :
                      item.status === 'current' ? 'bg-accent border-accent' :
                      'bg-white border-gray-300'}`}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between">
                  <div>
                    <h4 className={`font-medium
                      ${item.status === 'completed' ? 'text-secondary' :
                        item.status === 'current' ? 'text-accent' :
                        'text-gray-500'}`}>
                      {item.phase}
                    </h4>
                    {item.phase === 'Project Submission by Organizer' && item.status === 'current' && (
                      <button
                        onClick={() => {
                          setSelectedEvent({ id: 1, name: 'Code Sprint Q1' })
                          setIsProblemModalOpen(true)
                        }}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-light"
                      >
                        Submit Project Statements
                      </button>
                    )}
                    {item.status === 'current' && (
                      <button
                        onClick={() => completePhase(item.key)}
                        className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-light"
                      >
                        Finish Phase
                      </button>
                    )}
                  </div>
                  {item.status === 'current' && (
                    <span className="mt-2 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent">
                      Current Phase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            {['all', 'past', 'ongoing', 'future'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize
                  ${activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teams
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{event.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(event.startDate), 'MMM d, yyyy')} - 
                      {format(new Date(event.endDate), 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${event.status === 'ongoing' ? 'bg-secondary/10 text-secondary' : 
                        event.status === 'future' ? 'bg-accent/10 text-accent' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.participants}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.teams}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-accent hover:text-accent-light">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateEventModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ProblemStatementModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        onSubmit={handleProblemSubmit}
        event={selectedEvent}
      />
    </div>
  )
}

export default OrganizerDashboard