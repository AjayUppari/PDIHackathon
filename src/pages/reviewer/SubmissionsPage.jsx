import React from 'react';
import SubmissionsList from '../../components/reviewer/submissionsList';
import Navbar from '../../components/Navbar';

function SubmissionsPage() { 

  function validateUserAndDisplayView(){
    const userRole = localStorage.getItem('userRole')
    if(userRole === 'Reviewer'){
      return(
        <>
          <Navbar userType="User" username={JSON.parse(localStorage.getItem("userData")).name} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Review Submissions</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Review team submissions and provide feedback and scores.
                </p>
              </div>
              <SubmissionsList />
            </div>
        </>
      )
    }
    else{
      return <div>You are not authorized to view this page</div>
    }
  }
  
  return validateUserAndDisplayView()
}

export default SubmissionsPage;