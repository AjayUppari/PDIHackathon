import { useState } from 'react'
import { Dialog } from '@headlessui/react'

function ProjectSubmissionModal({ isOpen, onClose, onSubmit, eventId }) {
  const [formData, setFormData] = useState({
    repositoryUrl: '',
    deployedUrl: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const userId = JSON.parse(localStorage.getItem('userData')).userId

    console.log({
      userId: userId,
      eventId: eventId,
      CodeRepoLink: formData.repositoryUrl,
      CodeDemoLink: formData.deployedUrl,
    })

    const response = await fetch("http://localhost:5000/codeSubmission", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        eventId: eventId,
        CodeRepoLink: formData.repositoryUrl,
        CodeDemoLink: formData.deployedUrl,
      }),
    })
    const data = await response.json()
    console.log(data)

  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Submit Project
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Repository URL</label>
              <input
                type="url"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.repositoryUrl}
                onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                placeholder="e.g., https://github.com/username/project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Deployed URL</label>
              <input
                type="url"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.deployedUrl}
                onChange={(e) => setFormData({ ...formData, deployedUrl: e.target.value })}
                placeholder="e.g., https://your-project.netlify.app"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ProjectSubmissionModal