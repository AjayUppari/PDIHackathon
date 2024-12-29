import { useEffect, useState } from 'react'
import EventsGrid from './organizer/EventsGrid'

const mockEvents = {
  ongoing: [
    {
      id: 1,
      name: "Code Sprint Q1",
      startDate: "2024-03-01",
      endDate: "2024-03-03",
      status: "ongoing",
      participants: 45,
      teams: 12,
    }
  ],
  future: [
    {
      id: 2,
      name: "Innovation Challenge 2024",
      startDate: "2024-04-15",
      endDate: "2024-04-17",
      status: "future",
      participants: 0,
      teams: 0,
    }
  ],
  past: [
    {
      id: 3,
      name: "Tech Summit Hackathon",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      status: "past",
      participants: 60,
      teams: 15,
    }
  ]
};

function ParticipantDashboard() {
  const [eventsData, setMockEvents] = useState(null); // Initialize as null to distinguish between empty data and uninitialized state
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    async function fetchAllEvents() {
      try {
        const eventsResponse = await fetch('http://localhost:5000/events');
        if (!eventsResponse.ok) {
          throw new Error(`Error fetching events: ${eventsResponse.statusText}`);
        }
        const eventsJsonData = await eventsResponse.json();
        setMockEvents(eventsJsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!eventsData || Object.keys(eventsData).length === 0) return <div>No events found.</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {mockEvents.ongoing.length > 0 && (
        <EventsGrid events={eventsData.ongoing} title="Ongoing Events" />
      )}
      
      {mockEvents.future.length > 0 && (
        <EventsGrid events={eventsData.future} title="Upcoming Events" />
      )}
      
      {mockEvents.past.length > 0 && (
        <EventsGrid events={eventsData.past} title="Past Events" />
      )}
    </div>
  )
}

export default ParticipantDashboard