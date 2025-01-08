function ProblemsSection({ problems }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Problem Statements</h2>
      <div className="space-y-4">
        {problems.map((problem) => (
          <div 
            key={problem.problem_id} 
            className="border border-blue-300 rounded-lg p-4"
          >
            <h6 className="font-medium text-lg text-gray-900 mb-2">
              {problem.problem_name}
            </h6>
            <p className="text-gray-600">
              {problem.problem_description}
            </p>
          </div>
        ))}
        {problems.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No problem statements available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ProblemsSection;