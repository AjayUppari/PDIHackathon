const createEmployeesTable = `
  CREATE TABLE Employees (
    EmpId INT PRIMARY KEY IDENTITY(1,1),
    EmailId  NVARCHAR(100) NOT NULL,
    Role NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    Password NVARCHAR(MAX) NOT NULL,
    IsSelected NVARCHAR(5) NULL
  );
`;

const createEventTable = `
CREATE TABLE Events (
  EventId INT PRIMARY KEY IDENTITY(1,1),
  Name NVARCHAR(255) NOT NULL,
  Rules NVARCHAR(MAX) NOT NULL,
  First NVARCHAR(255),
  Second NVARCHAR(255),
  Third NVARCHAR(255),
  Past NVARCHAR(5),
  Ongoing NVARCHAR(5),
  Future NVARCHAR(5)
);`;

const createEventTimelineTable = `
CREATE TABLE EventTimeline (
    TimelineID INT IDENTITY(1,1) PRIMARY KEY,
    EventID INT NOT NULL,
    Registration VARCHAR(9) NOT NULL,
    ProblemsSubmission VARCHAR(9) NOT NULL,
    ChooseProblem VARCHAR(9) NOT NULL,
    DocumentSubmission VARCHAR(9) NOT NULL,
    ProjectSubmission VARCHAR(9) NOT NULL,
    ReviewerSubmission VARCHAR(9) NOT NULL,
    ResultsAnnouncement VARCHAR(9) NOT NULL
);
`

const createEventDates = `
CREATE TABLE EventDates (
  DateId INT PRIMARY KEY IDENTITY(1,1),
  EventId INT,
  Registration DATE,
  TeamSubmission DATE,
  TeamLeadSelection DATE,
  DocumentSubmission DATE,
  ProjectSubmission DATE,
  ReviewerSubmission DATE,
  ResultsAnnouncement DATE,
  FOREIGN KEY (EventId) REFERENCES Events(EventId)
);
`;

const createEventParticipants = `
CREATE TABLE EventParticipants (
  ParticipantId INT PRIMARY KEY IDENTITY(1,1),
  EventId INT,
  Name NVARCHAR(255) NOT NULL,
  Email NVARCHAR(255) NOT NULL,
  EmpId INT,
  TeamMember NVARCHAR(5),
  FOREIGN KEY (EmpId) REFERENCES Employees(EmpId),
  FOREIGN KEY (EventId) REFERENCES Events(EventId)
);
`;

const getOngoingEventId = `
  SELECT EventId 
  FROM Events
  Where Ongoing = 'true';
`

const getEventsData =`
SELECT 
  e.EventId,
  e.Name AS Name,
  e.Rules AS Rules,
  e.First AS PrizeFirst,
  e.Second AS PrizeSecond,
  e.Third AS PrizeThird,  
  e.Past,
  e.Ongoing,
  e.Future,
  e.ImageUrl,
  ed.Registration,
  ed.TeamSubmission,
  ed.TeamLeadSelection,
  ed.DocumentSubmission,
  ed.ProjectSubmission,
  ed.ReviewerSubmission,
  ed.ResultsAnnouncement,
  (
    SELECT 
      ep.Name, 
      ep.Email,
      ep.EmpId,
      ep.TeamMember,
      ep.TeamId
    FROM 
      EventParticipants ep 
    WHERE 
      ep.EventId = e.EventId
    FOR JSON PATH
  ) AS Participants,
  (
    SELECT 
      COUNT(DISTINCT ep.TeamId)
    FROM 
      EventParticipants ep
    WHERE 
      ep.EventId = e.EventId
  ) AS DistinctTeamCount
FROM 
  Events e
JOIN 
  EventDates ed ON e.EventId = ed.EventId;
`;

const getEventsDataNew = `
  SELECT 
  e.EventId,
  e.Name AS Name,
  e.Rules AS Rules,
  e.First AS PrizeFirst,
  e.Second AS PrizeSecond,
  e.Third AS PrizeThird,  
  e.Past,
  e.Ongoing,
  e.Future,
  e.ImageUrl,
  ed.Registration,
  ed.ProblemsSubmission,
  ed.ChooseProblem,
  ed.DocumentSubmission,
  ed.ProjectSubmission,
  ed.ReviewerSubmission,
  ed.ResultsAnnouncement,
  et.TimelineID,
  et.Registration AS TimelineRegistration,
  et.ProblemsSubmission AS TimelineProblemsSubmission,
  et.ChooseProblem AS TimelineChooseProblem,
  et.DocumentSubmission AS TimelineDocumentSubmission,
  et.ProjectSubmission AS TimelineProjectSubmission,
  et.ReviewerSubmission AS TimelineReviewerSubmission,
  et.ResultsAnnouncement AS TimelineResultsAnnouncement,
  (
    SELECT 
      ep.Name, 
      ep.Email,
      ep.EmpId,
      ep.TeamMember,
      ep.TeamId
    FROM 
      EventParticipants ep 
    WHERE 
      ep.EventId = e.EventId
    FOR JSON PATH
  ) AS Participants,
  (
    SELECT 
      COUNT(DISTINCT ep.TeamId)
    FROM 
      EventParticipants ep
    WHERE 
      ep.EventId = e.EventId
  ) AS DistinctTeamCount
FROM 
  Events e
JOIN 
  EventDates ed ON e.EventId = ed.EventId
JOIN 
  EventTimeline et ON e.EventId = et.EventId; 
`

const getEventDataById=`
SELECT 
  e.EventId,
  e.Name AS Name,
  e.Rules AS Rules,
  e.First AS PrizeFirst,
  e.Second AS PrizeSecond,
  e.Third AS PrizeThird,  
  e.Past,
  e.Ongoing,
  e.Future,
  e.ImageUrl,
  ed.Registration,
  ed.ProblemsSubmission,
  ed.ChooseProblem,
  ed.DocumentSubmission,
  ed.ProjectSubmission,
  ed.ReviewerSubmission,
  ed.ResultsAnnouncement,
  (
    SELECT 
      ep.Name, 
      ep.Email,
      ep.EmpId,
      ep.TeamMember,
      ep.TeamId
    FROM 
      EventParticipants ep 
    WHERE 
      ep.EventId = e.EventId
    FOR JSON PATH
  ) AS Participants,
  (
    SELECT 
      COUNT(DISTINCT ep.TeamId)
    FROM 
      EventParticipants ep
    WHERE 
      ep.EventId = e.EventId
  ) AS DistinctTeamCount
FROM 
  Events e
JOIN 
  EventDates ed ON e.EventId = ed.EventId
where
	e.EventId=@eventId;
`;

const getEventDataByIdNew = `
  SELECT 
  e.EventId,
  e.Name AS Name,
  e.Rules AS Rules,
  e.First AS PrizeFirst,
  e.Second AS PrizeSecond,
  e.Third AS PrizeThird,  
  e.Past,
  e.Ongoing,
  e.Future,
  e.ImageUrl,
  ed.Registration,
  ed.ProblemsSubmission,
  ed.ChooseProblem,
  ed.DocumentSubmission,
  ed.ProjectSubmission,
  ed.ReviewerSubmission,
  ed.ResultsAnnouncement,
  et.TimelineID,
  et.Registration AS TimelineRegistration,
  et.ProblemsSubmission AS TimelineProblemsSubmission,
  et.ChooseProblem AS TimelineChooseProblem,
  et.DocumentSubmission AS TimelineDocumentSubmission,
  et.ProjectSubmission AS TimelineProjectSubmission,
  et.ReviewerSubmission AS TimelineReviewerSubmission,
  et.ResultsAnnouncement AS TimelineResultsAnnouncement,
  (
    SELECT 
      ep.Name, 
      ep.Email,
      ep.EmpId,
      ep.TeamMember,
      ep.TeamId
    FROM 
      EventParticipants ep 
    WHERE 
      ep.EventId = e.EventId
    FOR JSON PATH
  ) AS Participants,
  (
    SELECT 
      COUNT(DISTINCT ep.TeamId)
    FROM 
      EventParticipants ep
    WHERE 
      ep.EventId = e.EventId
  ) AS DistinctTeamCount
FROM 
  Events e
JOIN 
  EventDates ed ON e.EventId = ed.EventId
JOIN 
  EventTimeline et ON e.EventId = et.EventId
WHERE
  e.EventId = @eventId;
`

const getTimelineByEventID = `
  select * from EventTimeline
  where EventID = @eventId;
`

const getEmployeeData = `
  SELECT EmailId, IsSelected 
FROM Employees 
WHERE Role <> 'Organizer' AND Role <> 'Reviewer' AND EmailId LIKE '@emailId%';
;
`;

const getTeamsData = `
  SELECT TeamName FROM Teams WHERE EventId=@eventId;
;
`;

const getProbsData = `
  SELECT ProbId,ProbName, ProbDesc, IsAvailable FROM ProblemStatements WHERE EventId=@eventId;
;
`;

const teamCreate = `
INSERT INTO Teams (TeamName, EventId)
    OUTPUT INSERTED.TeamId
    VALUES (@teamName, @eventId);
`;

const addParticipants = `
  INSERT INTO EventParticipants (EventId,Name, Email,EmpId ,TeamMember, TeamId)
      VALUES (@eventId,@name, @email,@empid,@teamMember , @teamId);
`;

const insertProblemStatement = `
      INSERT INTO ProblemStatements (ProbName, ProbDesc, EventId,IsAvailable)
        OUTPUT INSERTED.ProbId
        VALUES (@probName, @probDesc, @eventId,@isAvail);
`;

const insertEvents = `
        INSERT INTO EVENT (event_name, rules, first_prize, second_prize, third_prize, status, poster_link, organizer_id, is_published, last_modified_date, team_size, registration_start_date, registration_end_date, problem_selection_deadline, document_submission_deadline, project_submission_deadline, reviewer_submission_deadline, results_announcement_date)
        OUTPUT INSERTED.event_id
        VALUES (@eventName, @rules, @first, @second, @third, @status, @posterLink, @organizerId, @isPublished, @lastModifiedDate, @teamSize, @registrationStart, @registrationEnd, @chooseProblem, @designSubmission, @projectSubmission, @reviewSubmissions, @results);
`;

const updateEventQuery = `
  UPDATE EVENT
  SET 
    event_name = @eventName,
    rules = @rules,
    first_prize = @first,
    second_prize = @second,
    third_prize = @third,
    status = @status,
    poster_link = @posterLink,
    organizer_id = @organizerId,
    is_published = @isPublished,
    last_modified_date = @lastModifiedDate,
    team_size = @teamSize,
    registration_start_date = @registrationStart,
    registration_end_date = @registrationEnd,
    problem_selection_deadline = @chooseProblem,
    document_submission_deadline = @designSubmission,
    project_submission_deadline = @projectSubmission,
    reviewer_submission_deadline = @reviewSubmissions,
    results_announcement_date = @results
  WHERE event_id = @eventId;
`;

const insertEventDates = `
INSERT INTO EventDates (
          EventId,
          Registration,
          ProblemsSubmission,
          ChooseProblem,
          DocumentSubmission,
          ProjectSubmission,
          ReviewerSubmission,
          ResultsAnnouncement
        )
        VALUES (
          @eventId,
          @registration,
          @problemsSubmission,
          @chooseProblem,
          @documentSubmission,
          @projectSubmission,
          @reviewerSubmission,
          @resultsAnnouncement
        );
`;

const createTimeline = `
      INSERT INTO EventTimeline
           (            
            EventID,
            Registration,
            ProblemsSubmission,
            ChooseProblem,
            DocumentSubmission,
            ProjectSubmission,
            ReviewerSubmission,
            ResultsAnnouncement
           )
      VALUES
           (
            @eventId,
            @registration,
            @problemsSubmission,
            @chooseProblem,
            @documentSubmission,
            @projectSubmission,
            @reviewerSubmission,
            @resultsAnnouncement
          )
`;

const docSubmit = `
        INSERT INTO ProjectDocuments (TeamId,EventId, DocumentUrl)
        VALUES (@teamId,@eventId, @DocumentUrl);
`;

const codeSubmit = `
INSERT INTO CodeSubmissions (CodeRepoLink, CodeDemoLink, TeamId, EventId, DocumentId)
                VALUES (@RepoLink, @DemoLink, @TeamId, @EventId, @DocumentId);
`;

const getCodeSubData=`
  SELECT 
    p.DocumentId, 
    p.DocumentUrl, 
    c.CodeRepoLink, 
    c.CodeDemoLink, 
    c.TeamId, 
    c.EventId
FROM 
    ProjectDocuments p
JOIN 
    CodeSubmissions c ON p.DocumentId = c.DocumentId
where
	c.EventId=1;
`;

const updateTimelinePhase = `
  UPDATE EventTimeline
   SET
      @currentPhaseKey = 'completed',
      @nextPhaseKey = 'current'
   WHERE EventID = @eventId
`

const updateAndPublishEventQuery = `
  UPDATE EVENT
  SET 
    event_name = @eventName,
    rules = @rules,
    first_prize = @first,
    second_prize = @second,
    third_prize = @third,
    status = @status,
    poster_link = @posterLink,
    organizer_id = @organizerId,
    is_published = @isPublished,
    last_modified_date = @lastModifiedDate,
    team_size = @teamSize,
    registration_start_date = @registrationStart,
    registration_end_date = @registrationEnd,
    problem_selection_deadline = @chooseProblem,
    document_submission_deadline = @designSubmission,
    project_submission_deadline = @projectSubmission,
    reviewer_submission_deadline = @reviewSubmissions,
    results_announcement_date = @results
  WHERE event_id = @eventId;
`;

module.exports = {
  createEmployeesTable,
  createEventTable,
  createEventDates,
  createEventParticipants,
  getEventsData,
  getEmployeeData,
  insertProblemStatement,
  teamCreate,
  addParticipants,
  insertEvents,
  insertEventDates,
  docSubmit,
  codeSubmit,
  getCodeSubData,
  getTeamsData,
  getProbsData,
  getEventDataById,
  createTimeline,
  getEventsDataNew,
  getEventDataByIdNew,
  getTimelineByEventID,
  getOngoingEventId,
  updateTimelinePhase,
  updateAndPublishEventQuery,
};
