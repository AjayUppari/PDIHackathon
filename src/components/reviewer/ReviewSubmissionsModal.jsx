import React, { useState } from 'react'
import { Dialog } from '@headlessui/react'

function ReviewSubmissionsModal({ isOpen, onClose, onSubmit, submissions }) {
  const [reviews, setReviews] = useState(
    submissions.map(sub => ({
      ...sub,
      score: sub.score || '',
      feedback: ''
    }))
  )

  const handleScoreChange = (teamId, score) => {
    setReviews(reviews.map(review => 
      review.teamId === teamId 
        ? { ...review, score: Math.min(100, Math.max(0, parseInt(score) || 0)) }
        : review
    ))
  }

  const handleFeedbackChange = (teamId, feedback) => {
    setReviews(reviews.map(review => 
      review.teamId === teamId 
        ? { ...review, feedback }
        : review
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(reviews)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-primary/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-primary mb-4">
            Review Team Submissions
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-6">
            {reviews.map((team) => (
              <div key={team.teamId} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-primary">{team.teamName}</h3>
                    <div className="mt-2 space-y-1">
                      <a 
                        href={team.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:text-accent-light block"
                      >
                        Repository Link
                      </a>
                      <a 
                        href={team.deployedUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-accent hover:text-accent-light block"
                      >
                        Deployed Application
                      </a>
                    </div>
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-primary">Score</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                      value={team.score}
                      onChange={(e) => handleScoreChange(team.teamId, e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary">Feedback</label>
                  <textarea
                    rows={3}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm"
                    value={team.feedback}
                    onChange={(e) => handleFeedbackChange(team.teamId, e.target.value)}
                    placeholder="Provide detailed feedback for the team"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-primary bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-light rounded-md"
              >
                Submit Reviews
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default ReviewSubmissionsModal