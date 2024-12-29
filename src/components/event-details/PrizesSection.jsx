function PrizesSection({ prizes }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Prizes</h2>
      <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Team 1</span>
            <span className="text-gray-700">{prizes.first}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Team 2</span>
            <span className="text-gray-700">{prizes.second}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Team 3</span>
            <span className="text-gray-700">{prizes.third}</span>
          </div>
      </div>
    </div>
  );
}

export default PrizesSection;