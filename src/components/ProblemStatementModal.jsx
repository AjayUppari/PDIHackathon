import { useState } from 'react'
import { Dialog } from '@headlessui/react'

function ProblemStatementModal({ isOpen, onClose, onSubmit, event }) {
  const [problems, setProblems] = useState(event?.problemStatements || [])
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: ''
  })

  const handleAddProblem = () => {
    if (newProblem.title && newProblem.description) {
      setProblems([...problems, { ...newProblem, id: Date.now() }])
      setNewProblem({ title: '', description: '' })
    }
  }

  const handleDeleteProblem = (id) => {
    setProblems(problems.filter(p => p.id !== id))
  }

  const handleSubmit = () => {
    onSubmit(problems)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Submit Problem Statements
          </Dialog.Title>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Problem Statement</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newProblem.title}
                    onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={4}
                    value={newProblem.description}
                    onChange={(e) => setNewProblem({ ...newProblem, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={handleAddProblem}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Add Problem Statement
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {problems.map((problem) => (
                      <tr key={problem.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {problem.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {problem.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDeleteProblem(problem.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {problems.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                          No problem statements added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Submit All Problems
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ProblemStatementModal