import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SubmissionsList() {
  const [submissions, setSubmissions] = useState([]);
  const [submissionData, setSubmissonData] = useState({
    score: 0,
    feedback: '',
    scoreError: false,
    feedbackError: false
  })
  const { eventId } = useParams()

  async function getSubmissionsData(){
    console.log('eventId is', eventId)
    const url = `http://localhost:5000/getCodeSubmissions?eventId=${eventId}`
    const submissionsResponse = await fetch(url)
    const submissionsJson = await submissionsResponse.json()

    console.log('fetched data is ', submissionsJson)

    const updatedJsonData = submissionsJson.map(eachSubmission => ({
      id: eachSubmission.team_id,
      teamName: eachSubmission.team_name,
      documentLink: eachSubmission.document_link,
      repoLink: eachSubmission.repository_link,
      liveLink: eachSubmission.live_link,
      score: eachSubmission.score,
      feedback: eachSubmission.feedback,
      status: eachSubmission.status,
      submissionId: eachSubmission.submission_id
    }))

    console.log('converted case into ', updatedJsonData)
    setSubmissions(updatedJsonData)
  }

  useEffect(()=>{
     getSubmissionsData()
  }, [])

  const handleStartReview = async (submissionId) => {
    // Here call API to update the status of API
    const url = "http://localhost:5000/changeReviewStatus"
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        eventId: eventId,
        submissionId: submissionId
      })
    })
    const jsonData = await response.json()
    console.log('jsonData is ', jsonData)
    getSubmissionsData()
  };

  const handleSubmitReview = async (submission) => {
    console.log('handle submit called')
    const statusChangeUrl = "http://localhost:5000/changeReviewToComplete"
    const scoreSubmissionUrl = "http://localhost:5000/scoreSubmission"

    console.log('submission is ', submission)

    // if(submission.score === null || submission.score === ''){
    //   setSubmissonData({...submissionData, scoreError: true})
    //   return
    // }
    // else{
    //   setSubmissonData({...submissionData, scoreError: false})
    // }

    // if(submission.feedback === null || submission.score === ''){
    //   setSubmissonData({...submissionData, feedbackError: true})
    //   return
    // }
    // else{
    //   setSubmissonData({...submissionData, feedbackError: false})
    // }

    const statusChangeResponse = await fetch(statusChangeUrl, {
      method: 'PUT',
      body: JSON.stringify({
        eventId: eventId,
        submissionId: submission.submissionId,
      })
    })

    const userId = JSON.parse(localStorage.getItem('userData')).userId
    const scoreSubmissionResponse = await fetch(scoreSubmissionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        score: submissionData.score,
        feedback: submissionData.feedback,
        userId: userId,
        submissionId: submission.submissionId,
        eventId: eventId
      })
    })
    const jsonData = await scoreSubmissionResponse.json()
    
    getSubmissionsData()

  };

  const handleInputChange = (submissionId, field, value) => {
    if(field === "score"){
      setSubmissonData({
        ...submissionData, score: parseInt(value)
      })
    }
    else if(field === 'feedback'){
      setSubmissonData({
        ...submissionData, feedback: value
      })
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Progress':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Team Submissions</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Links
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.map((submission) => (
              <tr key={submission.submissionId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {submission.teamName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <a href={submission.documentLink} target="_blank" rel="noopener noreferrer" 
                      className="text-indigo-600 hover:text-indigo-900">Doc</a>
                    <a href={submission.repoLink} target="_blank" rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900">Repo</a>
                    <a href={submission.liveLink} target="_blank" rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900">Live</a>
                  </div>
                </td>
                <td className="px-2 py-4 whitespace-nowrap">
                  <input
                    placeholder='Enter Score'
                    type="number"
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    value={submission.score}
                    onChange={(e) => handleInputChange(submission.submissionId, 'score', e.target.value)}
                    disabled={submission.status !== 'Progress'}
                  />
                  {submissionData.scoreError && <p className='text-red-600 p-2'>Score cannot be empty</p>}
                </td>
                <td className="px-6 py-4">
                  <textarea
                      placeholder='Give a brief feedback'
                      rows="4"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={submission.feedback}
                      onChange={(e) => handleInputChange(submission.submissionId, 'feedback', e.target.value)}
                      disabled={submission.status !== 'Progress'}
                    />                  
                  {submissionData.feedbackError && <p className='text-red-600 p-2'>Feedback cannot be empty</p>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(submission.status)}`}>
                    {submission.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {submission.status === 'pending' && (
                    <button
                      onClick={() => handleStartReview(submission.submissionId)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Start Review
                    </button>
                  )}
                  {submission.status === 'Progress' && (
                    <button
                      onClick={() => handleSubmitReview(submission)}
                      className="text-green-600 hover:text-green-900"
                    >
                      {submission.status === 'complete' ? 'Completed' : 'Submit Review'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SubmissionsList;