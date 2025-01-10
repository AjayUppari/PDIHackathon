import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
import EventHeader from '../components/event-details/EventHeader';
import RulesSection from '../components/event-details/RulesSection';
import PrizesSection from '../components/event-details/PrizesSection';
import EventStats from '../components/event-details/EventStats';
import TeamsTable from '../components/event-details/TeamsTable';
import EventTimeline from '../components/event-details/EventTimeline';
import ProblemsSection from '../components/event-details/problemsSection';
import Navbar from '../components/Navbar';

// Mock data
const eventData = {
  name: "Innovation Hackathon 2024",
  rules: [
    "Teams must consist of 2-5 members",
    "All team members must be registered",
    "Use of third-party code must be properly attributed",
    "Projects must be original work",
    "Submission deadline must be strictly followed"
  ],
  prizes: [5000, 3000, 1000],
  stats: {
    totalTeams: 10,
    totalParticipants: 50,
    problemCount: 5
  },
  teams: [
    {
      teamName: "Team1",
      problemName: "Problem1",
      docLink: "doclink1",
      repoLink: "repolink1",
      liveLink: "livelink1"
    },
    {
      teamName: "Team2",
      problemName: "Problem2",
      docLink: "doclink2",
      repoLink: "repolink2",
      liveLink: "livelink2"
    }
  ],
  phases: [
    { name: "Registration Start", deadline: "2024-02-02" },
    { name: "Registration End", deadline: "2024-02-03" },
    { name: "Choose Problem", deadline: "2024-02-04" },
    { name: "Submit Document", deadline: "2024-02-05" },
    { name: "Submit Project", deadline: "2024-02-06" },
    { name: "Review", deadline: "2024-02-07" },
    { name: "Results", deadline: "2024-02-08" }
  ]
};

function EventDetails() {

  const [eventDetailsData, setEventDetailsData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { eventId } = useParams();

  const location = useLocation()
  const data = location.state

  async function fetchAllEvents() {
    try {
      const eventsResponse = await fetch(`http://localhost:5000/event/${eventId}`);
      if (!eventsResponse.ok) {
        throw new Error(`Error fetching events: ${eventsResponse.statusText}`);
      }
      const eventsJsonData = await eventsResponse.json();
      console.log("Testing :",eventsJsonData)

      setEventDetailsData(eventsJsonData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    
    fetchAllEvents();
  }, []);

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!eventDetailsData || Object.keys(eventDetailsData).length === 0) return <div>No events found.</div>;

  console.log('eventDetails Data is ', eventDetailsData)
  
  return (
    <>
      <Navbar userType={"User"} username={JSON.parse(localStorage.getItem("userData")).name}/>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventHeader eventName={eventDetailsData.event_name} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <RulesSection rules={eventDetailsData.rules} />
              <ProblemsSection problems={eventDetailsData.problems} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrizesSection prizes={{first:eventDetailsData.first_prize,
                                      second:eventDetailsData.second_prize,
                                      third:eventDetailsData.third_prize}} />
                <EventStats stats={{teams:eventDetailsData.teams.length || 0,
                                    participants:eventDetailsData.totalParticipants || 0,
                                    problems:eventDetailsData.problems.length || 0
                }} />
              </div>
              <TeamsTable teams={eventDetailsData.teams} />
            </div>
            
            <div className="lg:col-span-1">
              <EventTimeline phases={[
                {name:"registration_start",deadline:eventDetailsData.registration_start_date, status: eventDetailsData.timeline.registration_start},
                {name:"registration_end",deadline:eventDetailsData.registration_end_date, status: eventDetailsData.timeline.registration_end},
                {name:"problem_selection",deadline:eventDetailsData.problem_selection_deadline, status: eventDetailsData.timeline.problem_selection},
                {name:"design_submission",deadline:eventDetailsData.document_submission_deadline, status: eventDetailsData.timeline.design_submission},
                {name:"project_submission",deadline:eventDetailsData.project_submission_deadline, status: eventDetailsData.timeline.project_submission},
                {name:"review",deadline:eventDetailsData.reviewer_submission_deadline, status: eventDetailsData.timeline.review},
                {name:"results",deadline:eventDetailsData.results_announcement_date, status: eventDetailsData.timeline.results},
                ]} eventId={eventDetailsData.event_id} teamMaxSize={eventDetailsData.team_size} eventStatus={eventDetailsData.status} 
                
                fetchAllEvents={fetchAllEvents}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;