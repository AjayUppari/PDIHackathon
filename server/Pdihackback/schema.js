const createEmployeesTable = `
  CREATE TABLE Employees (
    EmpId INT PRIMARY KEY IDENTITY(1,1),
    EmailId  NVARCHAR(100) NOT NULL,
    Role NVARCHAR(100) NOT NULL,
    Location NVARCHAR(100) NOT NULL,
    Password NVARCHAR(MAX) NOT NULL
  );
`;

const createEventTable=`
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

const createEventDates=`
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

const createEventParticipants=`
CREATE TABLE EventParticipants (
  ParticipantId INT PRIMARY KEY IDENTITY(1,1),
  EventId INT,
  Name NVARCHAR(255) NOT NULL,
  Email NVARCHAR(255) NOT NULL,
  EmpId INT,
  TeamLead NVARCHAR(5),
  TeamMember NVARCHAR(5),
  FOREIGN KEY (EmpId) REFERENCES Employees(EmpId),
  FOREIGN KEY (EventId) REFERENCES Events(EventId)
);
`;

const getEventsData=`
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
      ep.TeamLead,
      ep.TeamMember
    FROM 
      EventParticipants ep 
    WHERE 
      ep.EventId = e.EventId
    FOR JSON PATH
  ) AS Participants
FROM 
  Events e
JOIN 
  EventDates ed ON e.EventId = ed.EventId;
`;

module.exports={createEmployeesTable,createEventTable,createEventDates,createEventParticipants,getEventsData}