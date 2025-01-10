// import React from 'react';
// import SubmissionsList from '../../components/reviewer/submissionsList';
// import Navbar from '../../components/Navbar';

// function SubmissionsPage() { 

//   function validateUserAndDisplayView(){
//     const userRole = localStorage.getItem('userRole')
//     if(userRole === 'Reviewer'){
//       return(
//         <>
//           <Navbar userType="User" username={JSON.parse(localStorage.getItem("userData")).name} />
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//               <div className="mb-8">
//                 <h1 className="text-2xl font-bold text-gray-900">Review Submissions</h1>
//                 <p className="mt-2 text-sm text-gray-600">
//                   Review team submissions and provide feedback and scores.
//                 </p>
//               </div>
//               <SubmissionsList />
//             </div>
//         </>
//       )
//     }
//     else{
//       return <div>You are not authorized to view this page</div>
//     }
//   }
  
//   return validateUserAndDisplayView()
// }

// export default SubmissionsPage;

import React, { useState } from 'react';
import SubmissionsList from '../../components/reviewer/SubmissionsList';
import Navbar from '../../components/Navbar';

function SubmissionsPage() { 
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my-reviews'

  function validateUserAndDisplayView() {
    const userRole = localStorage.getItem('userRole')
    if(userRole === 'Reviewer') {
      return (
        <>
          <Navbar userType="User" username={JSON.parse(localStorage.getItem("userData")).name} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'all'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    All Submissions
                  </button>
                  <button
                    onClick={() => setActiveTab('my-reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === 'my-reviews'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    My Reviews
                  </button>
                </nav>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'all' ? 'Review Submissions' : 'My Reviews'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {activeTab === 'all' 
                  ? 'Review team submissions and provide feedback and scores.'
                  : 'View all your previous reviews and feedback.'}
              </p>
            </div>
            
            <SubmissionsList activeTab={activeTab} />
          </div>
        </>
      )
    }
    else {
      return <div>You are not authorized to view this page</div>
    }
  }
  
  return validateUserAndDisplayView()
}

export default SubmissionsPage;