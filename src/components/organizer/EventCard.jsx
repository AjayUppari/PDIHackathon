import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function EventCard({ event }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-[#00D2F4] text-white';
      case 'Upcoming':
        return 'bg-[#1226AA] text-white';
      default:
        return 'bg-gray-200 text-[#07003D]';
    }
  };

  return (
    <div 
      className="bg-white m-4 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/organizer/events/${event.id}`, {state: event})}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-[#07003D]">{event.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <p>
          <span className="font-medium">Start Date:</span>{' '}
          {format(new Date(event.startDate), 'MMM d, yyyy')}
        </p>
        <p>
          <span className="font-medium">End Date:</span>{' '}
          {format(new Date(event.endDate), 'MMM d, yyyy')}
        </p>
        <div className="flex justify-between mt-4 text-sm">
          <span>Teams: {event.teams}</span>
          <span>Participants: {event.participants}</span>
        </div>
      </div>
    </div>
  );
}

export default EventCard;