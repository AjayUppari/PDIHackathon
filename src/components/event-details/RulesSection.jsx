function RulesSection({ rules }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Rules</h2>
      <ul className="list-disc list-inside space-y-2">
        {rules.map((rule, index) => (
          <li key={index} className="text-gray-700">{rule}</li>
        ))}
      </ul>
    </div>
  );
}

export default RulesSection;