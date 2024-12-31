import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

function ProjectSelectionModal({ isOpen, onClose, onSubmit, eventId }) {
  const [problems, setProblems] = useState([]);

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   onSubmit(formData)
  // }

  useEffect(() => {
    async function getAllProblems() {
      const userId = JSON.parse(localStorage.getItem("userData")).userId;

      const url = `http://localhost:5000/getAllProblems?eventId=${eventId}&userId=${userId}`;

      const problemsResponse = await fetch(url);
      const searchEmployeesData = await problemsResponse.json();

      console.log("searchEmployeesData", searchEmployeesData);
      setProblems(searchEmployeesData.problemsData);
    }

    if (isOpen) {
      getAllProblems();
    }
  }, [isOpen]);

  async function SelectProblem(problemDetails) {
    const url = "http://localhost:5000/problemSelect";

    const problemsResponse = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: JSON.parse(localStorage.getItem("userData")).userId,
        eventId: eventId,
        ProbId: problemDetails.problem_id,
      }),
    });
    
    const searchEmployeesData = await problemsResponse.json();

    console.log("searchEmployeesData", searchEmployeesData);
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            Choose Project
          </Dialog.Title>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems
                .filter((problem) => problem.problem_id)
                .map((problem) => (
                  <tr key={problem.problem_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#07003D]">
                        {problem.problem_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#07003D]">
                        {problem.problem_description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {problem.problem_id ===
                      problems[problems.length - 1].selectedProblem ? (
                        <p>Selected</p>
                      ) : (
                        <button
                          onClick={() => SelectProblem(problem)}
                          className="text-[#00D2F4] hover:text-[#1226AA] mr-4"
                        >
                          Select
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default ProjectSelectionModal;
