import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import ParticipantSearch from './participantSearch';
import ConfirmationModal from './confirmationModal';

function TeamRegistrationModal({ isOpen, onClose, teamMaxSize, eventId }) {

  console.log('teamRegistrationModal called')
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function searchEmployees() {
        if (isOpen) {
            const url = 'http://localhost:5000/searchEmployees'
            
            const searchEmployeesResponse = await fetch(url)
            const searchEmployeesData = await searchEmployeesResponse.json()

          setSearchResults(searchEmployeesData);
        }
      }
    
        searchEmployees();
  }, [isOpen]);

  const handleAddMember = (participant) => {
    if (teamMembers.length > teamMaxSize) {
      setError(`Team size cannot exceed ${teamMaxSize} members`);
      return;
    }
    if(participant.isSelected === true){
        setError('Cannot add participant who is already registered in another Team or Ongoing event')
        return;
    }
    if (teamMembers.find(member => member.email === participant.email)) {
      setError('Participant already added to your team');
      return;
    }
    setTeamMembers([...teamMembers, participant]);
    setError('');
  };

  const handleRemoveMember = (email) => {
    setTeamMembers(teamMembers.filter(member => member.email !== email));
  };

  const handleRegister = () => {
    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }
    if (teamMembers.length < 2) {
      setError('Team must have at least 2 members');
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmRegistration = async () => {
    // API call to register team
    const userData = localStorage.getItem('userData')
    const body = { teamName, eventParticipants: teamMembers, user: JSON.parse(userData), eventId: eventId };

    const url = 'http://localhost:5000/createTeam'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })

    const data = await response.json()

    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Team Registration
            </Dialog.Title>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <ParticipantSearch onSelect={handleAddMember} searchResults={searchResults} />

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.email} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.email)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Register Team
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmRegistration}
        title="Confirm Registration"
        message="Are you sure you want to register this team? This action cannot be undone."
      />
    </>
  );
}

export default TeamRegistrationModal;