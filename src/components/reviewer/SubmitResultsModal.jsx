import React from 'react'
import { Dialog } from '@headlessui/react'

function SubmitResultsModal({ isOpen, onClose, onSubmit, submissions }) {
  const sortedSubmissions = [...submissions]
    .filter(sub => sub.score !== null)
    .sort((a, b) => b.score - a.score)

  const handleSubmit = () => {
    onSubmit(sortedSubmissions)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-primary/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-primary mb-4">
            Final Results
          </Dialog.Title>

          <div className="space-y-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-primary">Rank</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">Team</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-primary">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedSubmissions.map((team, index) => (
                    <tr key={team.teamId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {team.teamName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {team.score}/100
                      </td>
                    </tr>
                  ))}
                  {sortedSubmissions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No scored submissions yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={sortedSubmissions.length === 0}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md
                  ${sortedSubmissions.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-light'}`}
              >
                Publish Results
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default SubmitResultsModal