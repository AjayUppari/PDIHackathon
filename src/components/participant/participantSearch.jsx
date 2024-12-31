import { useState } from 'react';

// Mock participant data - replace with API call
const mockParticipants = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com' },
];

function ParticipantSearch({ onSelect, searchResults }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim()) {
      const filtered = searchResults.filter(p => 
        p.email.toLowerCase().includes(value.toLowerCase()) ||
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">
        Search Participants
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search by email or name"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
          {results.map((participant) => (
            <button
              key={participant.userId}
              onClick={() => {
                onSelect(participant);
                setSearch('');
                setResults([]);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50"
            >
              <div className='flex justify-between'>
                <div>
                  <p className="text-sm font-medium">{participant.name}</p>
                  <p className="text-sm text-gray-500">{participant.email}</p>
                </div>
                <p className={`text-white text-sm p-1 h-7 w-18 rounded-md ${participant.isSelected === true ? "bg-red-600" : "bg-green-500"}`}>{participant.isSelected === true ? 'Registered': "Available"}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ParticipantSearch;