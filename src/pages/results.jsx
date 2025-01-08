import Navbar from '../components/Navbar'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ResultsPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const { eventId } = useParams()

    async function getSubmissionsData(){
        const url = `http://localhost:5000/getCodeSubmissions?eventId=${eventId}`
        const submissionsResponse = await fetch(url)
        const submissionsJson = await submissionsResponse.json()
    
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
        setSubmissions(updatedJsonData)
      }
    
      useEffect(()=>{
         getSubmissionsData()
      }, [])

    return (
        <>
            <Navbar userType={'User'} />
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Results</h1>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Final Standings</h3>
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
                                    className="text-indigo-600 hover:text-indigo-900">Document</a>
                                    <a href={submission.repoLink} target="_blank" rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-900">Code</a>
                                    <a href={submission.liveLink} target="_blank" rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-900">Live</a>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                 <p>{submission.score}</p>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultsPage