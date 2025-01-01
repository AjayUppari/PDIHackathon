import { useState } from 'react'
import { Dialog } from '@headlessui/react'

function DocumentSubmissionModal({ isOpen, onClose, onSubmit, eventId }) {
  const [formData, setFormData] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const documentSubmissionForm = new FormData();

    const userId = JSON.parse(localStorage.getItem('userData')).userId
    const userAndEventDetails = {
      userId: userId,
      eventId: eventId
    }

    documentSubmissionForm.append("userAndEventDetails", JSON.stringify(userAndEventDetails)); // Append event data as JSON
    documentSubmissionForm.append("file", formData);
    
    console.log('formData:', documentSubmissionForm)

    const response = await fetch("http://localhost:5000/documentSub", {
      method: "POST",      
      body: documentSubmissionForm,
    })
    const data = await response.json()

  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Submit Project Document
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Document</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                onChange={(e) => {
                  console.log('File:', e.target.files[0])
                  setFormData(e.target.files[0])
                }}
              />
              <p className="mt-1 text-sm text-gray-500">PDF, DOC, or DOCX files only</p>
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

export default DocumentSubmissionModal