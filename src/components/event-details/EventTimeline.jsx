import { format } from 'date-fns';

async function onClickFinishPhase (phase, index){
  //Here call API for updating the phase status to finished
  const currentPhaseKey = phase
  let nextPhaseKey
  if(index < phasesData.length - 1){
    nextPhaseKey = phasesData[index+1].name
  }

  const eventId = eventID

  const url = 'http://localhost:5000/finishPhase'
  const data = {
    currentPhaseKey,
    nextPhaseKey,
    eventId
  }

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const jsonData = await response.json();

  console.log('response is ', jsonData)
}

function displayTimelinePhaseButtonBasedOnUserRole(phase, index){

  const userRole = localStorage.getItem('userRole');
  if(userRole === 'Organizer' && phase.status === 'active'){
    return (
      <button onClick={() => onClickFinishPhase(phase.name, index)} className="text-sm text-blue-500 hover:underline">Finish Phase</button>
    )
  }
  else if(userRole === 'null'){
    if(phase.name === 'registration_start' && phase.status === 'active'){
      return (
        <button className="text-sm text-blue-500">Register</button>
      )
    }
    else if(phase.name === 'problem_selection' && phase.status === 'active'){
      return (
        <button className="text-sm text-blue-500">Choose Problem</button>
      )
    }
    else if(phase.name === 'design_submission' && phase.status === 'active'){
      return (
        <button className="text-sm text-blue-500">Submit Document</button>
      )
    }
    else if(phase.name === 'project_submission' && phase.status === 'active'){
      return (
        <button className="text-sm text-blue-500">Submit Project</button>
      )
    }
  }
  else if(userRole === 'Reviewer'){
    if(phase.name === 'review' && phase.status === 'active'){
      return (
        <button className="text-sm text-blue-500">Review Submissions</button>
      )
    }
  }
}

function snakeToSentence(snakeCaseStr) {
  // Replace underscores with spaces
  let sentence = snakeCaseStr.replace(/_/g, ' ');

  // Convert the first character to uppercase and the rest to lowercase
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();

  return sentence;
}

let phasesData;
let eventID

function EventTimeline({ phases, eventId }) {

  phasesData = phases
  eventID = eventId
  console.log('phases are ', phasesData)
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Event Timeline</h2>
      <div className="relative">
        <div className={`absolute top-0 left-4 h-full w-0.5 bg-gray-200`}></div>
        <div className="space-y-8">
          {phases.map((phase, index) => (
            <div key={index} className="relative pl-10">
              <div className={`absolute left-3.5 -translate-x-1/2 w-3 h-3 rounded-full ${phase.status === 'active' ? 'bg-blue-500' : phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div>
                <h4 className="font-medium text-gray-900">{snakeToSentence(phase.name)}</h4>
                <p className="text-sm text-gray-500">
                  {format(new Date(phase.deadline), 'MM/dd/yyyy')}
                </p>
                {displayTimelinePhaseButtonBasedOnUserRole(phase, index)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventTimeline;