function EventStats({ stats }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Event Details</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Teams</span>
          <span className="font-medium">{stats.teams}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Participants</span>
          <span className="font-medium">{stats.participants}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">No. of Problems</span>
          <span className="font-medium">{stats.problems}</span>
        </div>
      </div>
    </div>
  );
}

export default EventStats;