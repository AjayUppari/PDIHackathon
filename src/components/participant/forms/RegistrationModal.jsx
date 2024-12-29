import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'

function RegistrationModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    teamName: '',
    teamSize: '',
    teamMembers: [{ name: '', email: '', role: '' }],
    preferredTechStack: '',
    projectPreference: ''
  })

  const addTeamMember = () => {
    if (formData.teamMembers.length < parseInt(formData.teamSize || 5)) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, { name: '', email: '', role: '' }]
      })
    }
  }

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > 1) {
      const newMembers = formData.teamMembers.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        teamMembers: newMembers
      })
    }
  }

  const updateTeamMember = (index, field, value) => {
    const newMembers = formData.teamMembers.map((member, i) => {
      if (i === index) {
        return { ...member, [field]: value }
      }
      return member
    })
    setFormData({
      ...formData,
      teamMembers: newMembers
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Register for Hackathon
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Team Size</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                >
                  <option value="">Select size</option>
                  {[2, 3, 4, 5].map(size => (
                    <option key={size} value={size}>{size} Members</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Team Members</label>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  + Add Member
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        required
                        placeholder="Role"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(index)}
                        className="text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Tech Stack</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.preferredTechStack}
                onChange={(e) => setFormData({ ...formData, preferredTechStack: e.target.value })}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Project Preference</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={formData.projectPreference}
                onChange={(e) => setFormData({ ...formData, projectPreference: e.target.value })}
                placeholder="Brief description of the type of project you'd like to work on"
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
                Register Team
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default RegistrationModal