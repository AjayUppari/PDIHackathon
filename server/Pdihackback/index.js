const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const { htmlToText } = require("html-to-text");
require("dotenv").config();
const authenticateToken = require("./Middleware/Auth");
const config = require("./config");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const {
  getEventsData,
  getEmployeeData,
  teamCreate,
  addParticipants,
  addTeamMember,
  insertEvents,
  insertEventDates,
  insertProblemStatement,
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
  updateEventQuery,
  updateAndPublishEventQuery,
} = require("./Model/Schema");
const sql = require("mssql");
const JWT_SECRET = process.env.JWT_SECRET;
const upload = multer({ storage: multer.memoryStorage() });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();

app.use(cors());
app.use(express.json());

//GET Requests

// app.get("/events", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);

//     // Fetch events where is_published = 'true'
//     const eventsQuery = `
//       SELECT * FROM EVENT WHERE is_published = 'true';
//     `;
//     const eventsResult = await pool.request().query(eventsQuery);
//     const events = eventsResult.recordset;

//     // Fetch related data for problems, teams, team members, submissions, and timelines
//     const problemsQuery = `SELECT * FROM PROBLEM;`;
//     const teamsQuery = `SELECT * FROM TEAM;`;
//     const teamMembersQuery = `SELECT * FROM TEAM_MEMBER;`;
//     const participantsQuery = `SELECT * FROM PARTICIPANT;`;
//     const usersQuery = `SELECT * FROM USER_COPY;`;
//     const submissionsQuery = `SELECT * FROM SUBMISSION;`;
//     const timelinesQuery = `SELECT * FROM TIMELINE;`;

//     const [problems, teams, teamMembers, participants, users, submissions, timelines] =
//       await Promise.all([
//         pool.request().query(problemsQuery),
//         pool.request().query(teamsQuery),
//         pool.request().query(teamMembersQuery),
//         pool.request().query(participantsQuery),
//         pool.request().query(usersQuery),
//         pool.request().query(submissionsQuery),
//         pool.request().query(timelinesQuery),
//       ]).then((results) => results.map((r) => r.recordset));

//     // Organize data for each event
//     const eventsData = events.map((event) => {
//       // Problems associated with the event
//       const eventProblems = problems.filter(
//         (problem) => problem.event_id === event.event_id
//       );

//       // Teams associated with the event
//       const eventTeams = teams
//         .filter((team) => team.event_id === event.event_id)
//         .map((team) => {
//           // Members of the team
//           const teamMembersData = teamMembers
//             .filter((member) => member.team_id === team.team_id)
//             .map((member) => {
//               const participant = participants.find(
//                 (p) => p.participant_id === member.participant_id
//               );
//               const user = users.find((u) => u.user_id === participant.user_id);

//               return {
//                 ...member,
//                 participant,
//                 user,
//               };
//             });

//           // Submissions by the team
//           const teamSubmissions = submissions.filter(
//             (sub) => sub.team_id === team.team_id
//           );

//           return {
//             ...team,
//             members: teamMembersData,
//             submissions: teamSubmissions,
//           };
//         });

//       // Timeline data for the event in structured format
//       const timelineData = timelines
//         .filter((timeline) => timeline.event_id === event.event_id)
//         .reduce(
//           (acc, timeline) => ({
//             registrationStartDate: timeline.registration_start_date || "",
//             registrationEndDate: timeline.registration_end_date || "",
//             problemSelection: timeline.problem_selection_deadline || "",
//             designSubmission: timeline.document_submission_deadline || "",
//             projectSubmission: timeline.project_submission_deadline || "",
//             review: timeline.reviewer_submission_deadline || "",
//             results: timeline.results_announcement_date || "",
//           }),
//           {}
//         );

//       return {
//         id: event.event_id,
//         name: event.event_name,
//         startDate: event.registration_start_date,
//         endDate: event.registration_end_date,
//         status: event.status,
//         participants: participants.filter(
//           (participant) => participant.event_id === event.event_id
//         ).length,
//         teams: eventTeams.length,
//         problems: eventProblems,
//         teamsData: eventTeams,
//         timelineData,
//       };
//     });

//     // Categorize events into ongoing, future, and past based on status column
//     const categorizedEvents = {
//       ongoing: eventsData.filter((event) => event.status === "Ongoing"),
//       future: eventsData.filter((event) => event.status === "Upcoming"),
//       past: eventsData.filter((event) => event.status === "Past"),
//     };

//     res.json(categorizedEvents);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ error: "An error occurred while fetching events data." });
//   }
// }); // this is main

app.get("/events", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // Fetch events where is_published = 'true'
    const eventsQuery = `
      SELECT * FROM EVENT WHERE is_published = 'true';
    `;
    const eventsResult = await pool.request().query(eventsQuery);
    const events = eventsResult.recordset;

    // Fetch related data
    const problemsQuery = `SELECT * FROM PROBLEM;`;
    const teamsQuery = `SELECT * FROM TEAM;`;
    const teamMembersQuery = `SELECT * FROM TEAM_MEMBER;`;
    const participantsQuery = `SELECT * FROM PARTICIPANT;`;
    const usersQuery = `SELECT * FROM USER_COPY;`;
    const submissionsQuery = `SELECT * FROM SUBMISSION;`;
    const timelinesQuery = `SELECT * FROM TIMELINE;`;

    const [problems, teams, teamMembers, participants, users, submissions, timelines] =
      await Promise.all([
        pool.request().query(problemsQuery),
        pool.request().query(teamsQuery),
        pool.request().query(teamMembersQuery),
        pool.request().query(participantsQuery),
        pool.request().query(usersQuery),
        pool.request().query(submissionsQuery),
        pool.request().query(timelinesQuery),
      ]).then((results) => results.map((r) => r.recordset));

    // Organize data for each event
    const eventsData = events.map((event) => {
      const eventProblems = problems.filter(
        (problem) => problem.event_id === event.event_id
      );

      const eventTeams = teams
        .filter((team) => team.event_id === event.event_id)
        .map((team) => {
          const teamMembersData = teamMembers
            .filter((member) => member.team_id === team.team_id)
            .map((member) => {
              const participant = participants.find(
                (p) => p.participant_id === member.participant_id
              );
              const user = users.find((u) => u.user_id === participant.user_id);

              return {
                ...member,
                participant,
                user,
              };
            });

          const teamSubmissions = submissions.filter(
            (sub) => sub.team_id === team.team_id
          );

          return {
            ...team,
            members: teamMembersData,
            submissions: teamSubmissions,
          };
        });

      const timelineData = timelines
        .filter((timeline) => timeline.event_id === event.event_id)
        .reduce(
          (acc, timeline) => ({
            registrationStartDate: timeline.registration_start || "",
            registrationEndDate: timeline.registration_end || "",
            problemSelection: timeline.problem_selection || "",
            designSubmission: timeline.design_submission || "",
            projectSubmission: timeline.project_submission || "",
            review: timeline.review || "",
            results: timeline.results || "",
          }),
          {}
        );
      
      console.log(event)

      return {
        id: event.event_id,
        registrationStart: event.registration_end_date,
        name: event.event_name,
        startDate: event.registration_start_date,
        endDate: event.registration_end_date,
        status: event.status,
        participants: participants.filter(
          (participant) => participant.event_id === event.event_id
        ).length,
        teams: eventTeams.length,
        problems: eventProblems,
        teamsData: eventTeams,
        timelineData,
      };
    });

    const categorizedEvents = {
      ongoing: eventsData.filter((event) => event.status === "Ongoing"),
      future: eventsData.filter((event) => event.status === "Upcoming"),
      past: eventsData.filter((event) => event.status === "Past"),
    };

    res.json(categorizedEvents);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching events data." });
  }
}); // this API worked

// app.get("/getPublishedEvents", async (req, res) => {
//   try {
//     const pool = await sql.connect(config);

//     // Fetch all events with is_published = 'true'
//     const eventsQuery = `
//       SELECT * FROM EVENT WHERE is_published = 'true';
//     `;
//     const eventsResult = await pool.request().query(eventsQuery);
//     const events = eventsResult.recordset;

//     // Prepare to fetch problems, teams, team members, submissions, and timeline data
//     const eventIds = events.map(event => event.event_id);

//     // Fetch problems for all events
//     const problemsQuery = `
//       SELECT * FROM PROBLEM WHERE event_id IN (${eventIds.join(",")});
//     `;
//     const problemsResult = await pool.request().query(problemsQuery);
//     const problems = problemsResult.recordset;

//     // Fetch teams for all events
//     const teamsQuery = `
//       SELECT * FROM TEAM WHERE event_id IN (${eventIds.join(",")});
//     `;
//     const teamsResult = await pool.request().query(teamsQuery);
//     const teams = teamsResult.recordset;

//     // Fetch team members
//     const teamIds = teams.map(team => team.team_id);
//     const teamMembersQuery = `
//       SELECT tm.*, p.*, u.* FROM TEAM_MEMBER tm
//       JOIN PARTICIPANT p ON tm.participant_id = p.participant_id
//       JOIN [USER] u ON p.user_id = u.user_id
//       WHERE tm.team_id IN (${teamIds.join(",")});
//     `;
//     const teamMembersResult = await pool.request().query(teamMembersQuery);
//     const teamMembers = teamMembersResult.recordset;

//     // Fetch submissions
//     const submissionsQuery = `
//       SELECT * FROM SUBMISSION WHERE team_id IN (${teamIds.join(",")});
//     `;
//     const submissionsResult = await pool.request().query(submissionsQuery);
//     const submissions = submissionsResult.recordset;

//     // Fetch timeline data
//     const timelineQuery = `
//       SELECT * FROM TIMELINE WHERE event_id IN (${eventIds.join(",")});
//     `;
//     const timelineResult = await pool.request().query(timelineQuery);
//     const timelines = timelineResult.recordset;

//     // Map data to events
//     const eventsWithDetails = events.map(event => {
//       const eventProblems = problems.filter(problem => problem.event_id === event.event_id);
//       const eventTeams = teams
//         .filter(team => team.event_id === event.event_id)
//         .map(team => {
//           const members = teamMembers.filter(member => member.team_id === team.team_id);
//           const teamSubmissions = submissions.filter(sub => sub.team_id === team.team_id);
//           return {
//             ...team,
//             members: members.map(member => ({
//               team_member_id: member.team_member_id,
//               is_teamlead: member.is_teamlead,
//               team_id: member.team_id,
//               participant_id: member.participant_id,
//               participant: {
//                 participant_id: member.participant_id,
//                 user_id: member.user_id,
//                 isSelected: member.isSelected,
//                 event_id: member.event_id,
//               },
//               user: {
//                 user_id: member.user_id,
//                 username: member.username,
//                 email: member.email,
//                 role: member.role,
//               },
//             })),
//             submissions: teamSubmissions,
//           };
//         });
//       const eventTimeline = timelines.find(timeline => timeline.event_id === event.event_id);

//       return {
//         id: event.event_id,
//         name: event.event_name,
//         startDate: event.registration_start_date,
//         endDate: event.registration_end_date,
//         status: event.status,
//         participants: event.participants_count || 0,
//         teams: eventTeams.length,
//         problems: eventProblems,
//         teamsData: eventTeams,
//         timelineData: {
//           registrationStartDate: eventTimeline?.registration_start || "",
//           registrationEndDate: eventTimeline?.registration_end || "",
//           problemSelection: eventTimeline?.problem_selection || "",
//           designSubmission: eventTimeline?.design_submission || "",
//           projectSubmission: eventTimeline?.project_submission || "",
//           review: eventTimeline?.review || "",
//           results: eventTimeline?.results || "",
//         },
//       };
//     });

//     res.status(200).json(eventsWithDetails);
//   } catch (error) {
//     console.error("Error fetching published events:", error);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

app.get("/getEventsByCategory", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // Fetch all events with is_published = 'true'
    const eventsQuery = `
      SELECT * FROM EVENT WHERE is_published = 'true';
    `;
    const eventsResult = await pool.request().query(eventsQuery);
    const events = eventsResult.recordset;

    // Categorize events into ongoing, future, and past
    const today = new Date();
    const categorizedEvents = {
      ongoing: [],
      future: [],
      past: [],
    };

    events.forEach(event => {
      const startDate = new Date(event.registration_start_date);
      const endDate = new Date(event.registration_end_date);
      const participants = event.participants_count || 0;
      const teams = event.teams_count || 0;

      const eventObject = {
        id: event.event_id,
        name: event.event_name,
        startDate: event.registration_start_date,
        endDate: event.registration_end_date,
        status: "",
        participants,
        teams,
      };

      if (today >= startDate && today <= endDate) {
        eventObject.status = "ongoing";
        categorizedEvents.ongoing.push(eventObject);
      } else if (today < startDate) {
        eventObject.status = "future";
        categorizedEvents.future.push(eventObject);
      } else {
        eventObject.status = "past";
        categorizedEvents.past.push(eventObject);
      }
    });

    res.status(200).json(categorizedEvents);
  } catch (error) {
    console.error("Error categorizing events:", error);
    res.status(500).json({ error: "Failed to fetch and categorize events" });
  }
});

// event specific details
app.get('/event/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
      // Establish DB connection
      const pool = await sql.connect(config);

      // Query to fetch event details
      const eventQuery = `
          SELECT [event_id], [event_name], [registration_start_date], [registration_end_date],
                 [problem_selection_deadline], [document_submission_deadline],
                 [project_submission_deadline], [reviewer_submission_deadline],
                 [results_announcement_date], [status], [organizer_id],
                 [is_published], [last_modified_date], [team_size],
                 [first_prize], [second_prize], [third_prize], [poster_link], [rules]
          FROM [PDIHackathon].[dbo].[EVENT]
          WHERE [event_id] = @eventId;
      `;
      const eventResult = await pool.request()
          .input('eventId', sql.Int, eventId)
          .query(eventQuery);

      const eventData = eventResult.recordset[0];
      // console.log("Testing :",eventData)
      if (!eventData) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Query to fetch timeline data
      const timelineQuery = `
          SELECT [registration_start], [registration_end], [problem_selection],
                 [design_submission], [project_submission], [review], [results]
          FROM [PDIHackathon].[dbo].[TIMELINE]
          WHERE [event_id] = @eventId;
      `;
      const timelineResult = await pool.request()
          .input('eventId', sql.Int, eventId)
          .query(timelineQuery);

      eventData.timeline = timelineResult.recordset[0] || {};

      // Query to fetch problems
      const problemsQuery = `
          SELECT [problem_id], [problem_description], [event_id], [problem_name]
          FROM [PDIHackathon].[dbo].[PROBLEM]
          WHERE [event_id] = @eventId;
      `;
      const problemsResult = await pool.request()
          .input('eventId', sql.Int, eventId)
          .query(problemsQuery);

      eventData.problems = problemsResult.recordset;

      // Query to fetch teams
      const teamsQuery = `
          SELECT [team_id], [team_name], [event_id], [problem_id]
          FROM [PDIHackathon].[dbo].[TEAM]
          WHERE [event_id] = @eventId;
      `;
      const teamsResult = await pool.request()
          .input('eventId', sql.Int, eventId)
          .query(teamsQuery);

      const teams = teamsResult.recordset;

      let totalParticipants = 0;
      // Fetch team members and submissions for each team
      for (const team of teams) {
          const teamMembersQuery = `
              SELECT tm.[team_member_id], tm.[is_teamlead], tm.[team_id], tm.[participant_id],
                     p.[user_id], p.[isSelected], p.[event_id],
                     u.[username], u.[email], u.[role]
              FROM [PDIHackathon].[dbo].[TEAM_MEMBER] tm
              LEFT JOIN [PDIHackathon].[dbo].[PARTICIPANT] p ON tm.[participant_id] = p.[participant_id]
              LEFT JOIN [PDIHackathon].[dbo].[USER] u ON p.[user_id] = u.[user_id]
              WHERE tm.[team_id] = @teamId;
          `;
          const teamMembersResult = await pool.request()
              .input('teamId', sql.Int, team.team_id)
              .query(teamMembersQuery);

          team.members = teamMembersResult.recordset;
          totalParticipants += team.members.length;

          const submissionsQuery = `
              SELECT [submission_id], [team_id], [problem_id], [document_link],
                     [repository_link], [live_link]
              FROM [PDIHackathon].[dbo].[SUBMISSION]
              WHERE [team_id] = @teamId;
          `;
          const submissionsResult = await pool.request()
              .input('teamId', sql.Int, team.team_id)
              .query(submissionsQuery);

          team.submissions = submissionsResult.recordset;

          // Add problem name to the team data
          const problem = eventData.problems.find(p => p.problem_id === team.problem_id);
          if (problem) {
              team.problem_name = problem.problem_name;
          }
      }

      eventData.teams = teams;
      eventData.totalParticipants = totalParticipants;
      res.json(eventData);
  } catch (error) {
      console.error('Error fetching event details:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/getData", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const data = pool.request().query(getEventsDataNew);
    data.then((result) => {
      return res.json(result.recordset);
    });
  } catch (error) {
    console.error("Error with retrieving data from table : ", error);
  }
});

app.get("/getOngoingEventId", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const data = pool.request().query(getOngoingEventId);
    data.then((result) => {
      return res.json(result.recordset);
    });
  } catch (error) {
    console.error("Error with retrieving data from table : ", error);
  }
});

app.get("/getData/:id", async (req, res) => {
  // try {
  //   const eventId = req.params.id;
  //   const pool = await sql.connect(config);
  //   const data = pool.request()
  //   .input('eventId',sql.Int,eventId)
  //   .query(getEventDataByIdNew);
  //   data.then((result) => {
  //     return res.json(result.recordset[0]);
  //   });
  // } catch (error) {
  //   console.error("Error with retrieving data from table : ", error);
  // }

  try {
    const eventId = req.params.id;
    const pool = await sql.connect(config);

    const data = await pool
      .request()
      .input("eventId", sql.Int, eventId)
      .query(getEventDataById);
    const eventDetailsData = data.recordset[0];

    const timeLinedata = await pool
      .request()
      .input("eventId", sql.Int, eventId)
      .query(getTimelineByEventID);
    const timelineObjectData = timeLinedata.recordset[0];

    res.send({
      eventDetails: eventDetailsData,
      timelineData: timelineObjectData,
    });
  } catch (error) {
    console.error("Error with retrieving data from table : ", error);
  }
});

app.get("/getCodeSubmissions", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const data = pool.request().query(getCodeSubData);
    data.then((result) => {
      return res.json(result.recordset);
    });
  } catch (error) {
    console.error("Error with retrieving data from table : ", error);
  }
});

app.get("/getAllEmployees/:emailId", async (req, res) => {
  const { emailId } = req.params;
  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT EmpId, EmailId, IsSelected 
    FROM Employees 
    WHERE (Role <> 'Organizer' AND Role <> 'Reviewer' AND EmailId LIKE '${emailId}%') AND IsSelected = 'false';
    `);
  res.send(result.recordset);
});

app.get('/getAllEmployees',async(req,res)=>{

  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    select u.user_id,u.username,u.email,u.role,p.isSelected from USER_COPY u
    left join
    PARTICIPANT p
    on u.user_id=p.user_id
    where u.role is null AND p.event_id=1
    `);
  res.send(result.recordset);

})

app.get("/getAllTeams/:id", async (req, res) => {
  const eventId = req.params.id;
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("eventId", sql.Int, eventId)
    .query(getTeamsData);
  res.send(result.recordset);
});

app.get("/getAllProblems/:id", async (req, res) => {
  const eventId = req.params.id;
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("eventId", sql.Int, eventId)
    .query(getProbsData);
  res.send(result.recordset);
});

app.get("/", async (req, res) => {
  res.send("I am running on server now");
});

app.get("/home", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data", logged: req.user });
});

app.get("/getDraftsData", async (req, res) => {
  const pool = await sql.connect(config);
  const result = await pool.request().input("publish", sql.NVarChar, "false")
    .query(`
      SELECT 
    E.event_id,
    E.event_name,
    E.registration_start_date,
    E.registration_end_date,
    E.problem_selection_deadline,
    E.document_submission_deadline,
    E.project_submission_deadline,
    E.reviewer_submission_deadline,
    E.results_announcement_date,
    E.status,
    E.organizer_id,
    E.is_published,
    E.last_modified_date,
    E.team_size,
    E.first_prize,
    E.second_prize,
    E.third_prize,
    E.poster_link,
    E.rules,
    (
        SELECT 
            P.problem_id,
            P.problem_description,
            P.problem_name
        FROM PROBLEM P
        WHERE P.event_id = E.event_id
        FOR JSON PATH
    ) AS problem_statements
FROM EVENT E
WHERE E.is_published = 'false'
FOR JSON PATH;
      `);
  const finalResult =
    result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
  res.send(JSON.parse(finalResult));
});

app.get("/getDraftsDataNew", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().input("publish", sql.NVarChar, "false")
      .query(`
        SELECT 
          E.event_id,
          E.event_name,
          E.registration_start_date,
          E.registration_end_date,
          E.problem_selection_deadline,
          E.document_submission_deadline,
          E.project_submission_deadline,
          E.reviewer_submission_deadline,
          E.results_announcement_date,
          E.status,
          E.organizer_id,
          E.is_published,
          E.last_modified_date,
          E.team_size,
          E.first_prize,
          E.second_prize,
          E.third_prize,
          E.poster_link,
          E.rules,
          ISNULL((
              SELECT 
                  P.problem_id,
                  P.problem_description,
                  P.problem_name
              FROM PROBLEM P
              WHERE P.event_id = E.event_id
              FOR JSON PATH
          ), '[]') AS problem_statements
        FROM EVENT E
        WHERE E.is_published = 'false'
        FOR JSON PATH;
      `);

    if (result.recordset.length === 0) {
      res.send([]);
    } else {
      const finalResult =
        result.recordset[0]["JSON_F52E2B61-18A1-11d1-B105-00805F49916B"];
      res.send(JSON.parse(finalResult));
    }
  } catch (error) {
    console.error("Error fetching drafts data:", error);
    res.status(500).send({ error: "Failed to fetch drafts data" });
  }
});

app.get('/searchEmployees', async (req, res) => {
  try {
      // Connect to the database
      let pool = await sql.connect(config);

      // Query for ongoing events
      const eventsQuery = `
          SELECT event_id 
          FROM EVENT 
          WHERE status = 'ongoing';
      `;
      const ongoingEvents = await pool.request().query(eventsQuery);

      const eventIds = ongoingEvents.recordset.map(event => event.event_id).join(',');

      // Query for participants from ongoing events
      const participantsQuery = `
          SELECT p.user_id, p.isSelected, p.event_id, uc.username AS name, uc.email 
          FROM PARTICIPANT p
          JOIN EVENT e ON p.event_id = e.event_id
          JOIN USER_COPY uc ON p.user_id = uc.user_id
          WHERE p.event_id IN (${eventIds});
      `;

      // Query for users from USER_COPY
      const userCopyQuery = `
          SELECT uc.user_id, NULL AS isSelected, NULL AS event_id, uc.username AS name, uc.email 
          FROM USER_COPY uc 
          WHERE role IS NULL;
      `;

      // Execute queries
      const participants = await pool.request().query(participantsQuery);
      const userCopies = await pool.request().query(userCopyQuery);

      console.log("participants is ", participants)
      console.log("userCopies is ", userCopies)

      // Combine and process the results
      const combinedUsers = [
          ...participants.recordset.map(user => ({
              userId: user.user_id,
              name: user.name,
              email: user.email,
              isSelected: true,
              eventID: user.event_id,
          })),
          ...userCopies.recordset.map(user => ({
              userId: user.user_id,
              name: user.name,
              email: user.email,
              isSelected: false,
              eventID: null,
          })),
      ];

      // Remove duplicates by userId
      const uniqueUsers = combinedUsers.reduce((acc, user) => {
          if (!acc.find(u => u.userId === user.userId)) {
              acc.push(user);
          }
          return acc;
      }, []);

      res.json(uniqueUsers);
  } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
  }
});

app.get("/getAllProblems", async (req, res) => {
  const {eventId,userId} = req.query;

  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("eventId", sql.Int, parseInt(eventId))
    .query(getProbsData);

    const particpant = await pool
    .request()
    .input("userId", sql.Int, parseInt(userId))
    .input("eventId", sql.Int, parseInt(eventId))
    .query(
      "SELECT participant_id FROM PARTICIPANT WHERE user_id = @userId AND event_id=@eventId"
    );

  const team= await pool
    .request()
    .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
    .query("SELECT team_id from TEAM_MEMBER WHERE participant_id=@participantId")

  const selectedProblemId=await pool
    .request()
    .input("teamId",sql.Int,parseInt(team.recordset[0].team_id))
    .query("SELECT problem_id from TEAM where team_id=@teamId")
  res.send({problemsData: [...result.recordset,{selectedProblem:selectedProblemId.recordset[0].problem_id}]});
});


//POST Requests


app.post("/createTeam", async (req, res) => {
  const { teamName, user, eventParticipants, eventId } = req.body;
  console.log(req.body)

  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("teamName", sql.NVarChar, teamName) // Example team name
    .input("eventId", sql.Numeric, eventId) // Example event ID
    .query(teamCreate);
  const particpant= await pool
    .request()
    .input("userId", sql.Int, user.userId)
    .input("isSelected", sql.VarChar, "true")
    .input("eventId", sql.Int, eventId)
    .query(addParticipants);

  await pool
  .request()
  .input("isTeamLead",sql.VarChar,"true")
  .input("teamId",sql.Int,parseInt(result.recordset[0].team_id))
  .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
  .query(addTeamMember);

  console.log('event participants are ', eventParticipants)
  
  for (const participant of eventParticipants) {
    try {
      const employee = await pool
        .request()
        .input("email", sql.NVarChar, participant.email)
        .query("SELECT * FROM USER_COPY WHERE email = @email");
        console.log('employee is ', employee)
      const particpant= await pool
        .request()
        .input("userId", sql.Int, parseInt(employee.recordset[0].user_id))
        .input("isSelected", sql.VarChar, "true")
        .input("eventId", sql.Int, eventId)
        .query(addParticipants);
      await pool
      .request()
      .input("isTeamLead",sql.VarChar,"false")
      .input("teamId",sql.Int,parseInt(result.recordset[0].team_id))
      .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
      .query(addTeamMember);

      // console.log("Employee Details:", employee.recordset[0]);
    } catch (error) {
      console.error("Error fetching employee for email:", email, error);
    }
  }
  res.send({message: "created successfully"});
});

// app.post("/createTeams", async (req, res) => {
//   const { teamName, user, eventParticipants, eventId } = req.body;

//   const pool = await sql.connect(config);

//   const teamLeadSelect = await pool
//     .request()
//     .input("teamLeadSelect", sql.NVarChar, "true")
//     .input("teamLeadEmail", sql.NVarChar, user.EmailId)
//     .query(
//       "update Employees set IsSelected=@teamLeadSelect where EmailId=@teamLeadEmail"
//     );

//   for (var mail of eventParticipants) {
//     await pool
//       .request()
//       .input("teamMemSelect", sql.NVarChar, "true")
//       .input("teamMemEmail", sql.NVarChar, mail.EmailId)
//       .query(
//         "update Employees set IsSelected=@teamMemSelect where EmailId=@teamMemEmail"
//       );
//   }

//   const result = await pool
//     .request()
//     .input("teamName", sql.NVarChar, teamName) // Example team name
//     .input("eventId", sql.Numeric, eventId) // Example event ID
//     .query(teamCreate);
//   await pool
//     .request()
//     .input("eventId", sql.Int, eventId)
//     .input("name", sql.NVarChar, user.Name)
//     .input("email", sql.NVarChar, user.EmailId)
//     .input("empid", sql.Int, user.EmpId)
//     .input("teamMember", sql.NVarChar, "false")
//     .input("teamId", sql.Int, result.recordset[0].TeamId)
//     .query(addParticipants);
//   // console.log("Team id is ", result.recordset[0].TeamId); // Logs the generated TeamId
//   for (const email of eventParticipants) {
//     try {
//       const employee = await pool
//         .request()
//         .input("email", sql.NVarChar, email.EmailId)
//         .query("SELECT * FROM Employees WHERE EmailId = @email");
//       await pool
//         .request()
//         .input("eventId", sql.Int, eventId)
//         .input("name", sql.NVarChar, employee.recordset[0].Name)
//         .input("email", sql.NVarChar, employee.recordset[0].EmailId)
//         .input("empid", sql.Int, employee.recordset[0].EmpId)
//         .input("teamMember", sql.NVarChar, "true")
//         .input("teamId", sql.Int, result.recordset[0].TeamId)
//         .query(addParticipants);

//       // console.log("Employee Details:", employee.recordset[0]);
//     } catch (error) {
//       console.error("Error fetching employee for email:", email, error);
//     }
//   }
//   res.json({ success: true, message: "Team created successfully" });
// });

app.put("/selectEmployee", async (req, res) => {
  const { EmployeeId } = req.body;
  console.log(EmployeeId);

  const pool = await sql.connect(config);

  const IsAlreadySelected = await pool.request().query(`
    SELECT IsSelected
    FROM Employees
    WHERE EmpId = ${EmployeeId}
    `);

  if (IsAlreadySelected.recordset[0].IsSelected === "true") {
    res.send({ message: "Employee already selected by other team" });
  } else {
    await pool.request().query(`
      UPDATE Employees
      SET 
        IsSelected = 'true'
        WHERE EmpId = ${EmployeeId}
      `);
    res.send({ message: "EmpId selected successfully" });
  }
});

app.put("/removeEmployee", async (req, res) => {
  const { EmployeeId } = req.body;
  console.log(EmployeeId);

  const pool = await sql.connect(config);

  const IsAlreadySelected = await pool.request().query(`
    SELECT IsSelected
    FROM Employees
    WHERE EmpId = ${EmployeeId}
    `);

  if (IsAlreadySelected.recordset[0].IsSelected === "true") {
    await pool.request().query(`
      UPDATE Employees
      SET 
        IsSelected = 'false'
        WHERE EmpId = ${EmployeeId}
      `);
    res.send({ message: "EmpId removed successfully" });
  } else {
    res.send(400, { message: "employee not found" });
  }
});

app.post("/addProblemStatement", async (req, res) => {
  const { ProbName, ProbDesc, EventId, user } = req.body;

  const pool = await sql.connect(config);
  if (user.Role == "Organizer") {
    await pool
      .request()
      .input("probName", sql.NVarChar, ProbName)
      .input("probDesc", sql.NVarChar, ProbDesc)
      .input("eventId", sql.Int, EventId)
      .input("isAvail", sql.NVarChar, "true")
      .query(insertProblemStatement);
  } else {
    const employee = await pool
      .request()
      .input("email", sql.NVarChar, user.EmailId)
      .query("SELECT * FROM EventParticipants WHERE Email = @email");
    const result = await pool
      .request()
      .input("probName", sql.NVarChar, ProbName)
      .input("probDesc", sql.NVarChar, ProbDesc)
      .input("eventId", sql.Int, EventId)
      .input("isAvail", sql.NVarChar, "false")
      .query(insertProblemStatement);
    await pool
      .request()
      .input("probId", sql.Int, result.recordset[0].ProbId)
      .input("teamId", sql.Int, employee.recordset[0].TeamId)
      .input("eventId", sql.Int, EventId)
      .query(
        "UPDATE Teams SET ProbId=@probId WHERE TeamId=@teamId AND EventId=@eventId"
      );
  }
  res.send("added successfully");
});

app.post("/addProblems", async (req, res) => {
  const pool = await sql.connect(config);
  const { problemStatements, user } = req.body;

  if (user.Role == "Organizer") {
    // if problem is added by organizer
    if (!problemStatements || problemStatements.length === 0) {
      console.log("No problem statements to insert");
      return;
    }

    // Construct the query dynamically
    const values = problemStatements
      .map(
        (ps, index) =>
          `(@probName${index}, @probDesc${index}, @eventId${index}, @isAvail${index})`
      )
      .join(", ");

    const query = `
      INSERT INTO ProblemStatements (ProbName, ProbDesc, EventId, IsAvailable)
      OUTPUT INSERTED.ProbId
      VALUES ${values};
  `;

    const request = pool.request();

    // Add parameters dynamically
    problemStatements.forEach((ps, index) => {
      request.input(`probName${index}`, sql.NVarChar, ps.title);
      request.input(`probDesc${index}`, sql.NVarChar, ps.description);
      request.input(`eventId${index}`, sql.Int, 26);
      request.input(`isAvail${index}`, sql.NVarChar, "true");
    });

    console.log(problemStatements);

    try {
      const result = await request.query(query);
      res.send("Problems added successfully");
      console.log("Inserted records:", result.recordset); // Outputs inserted ProbIds
    } catch (err) {
      console.error("Error inserting records:", err);
    }
  } else {
    // if problem is added by participant
    const employee = await pool
      .request()
      .input("email", sql.NVarChar, user.EmailId)
      .query("SELECT * FROM EventParticipants WHERE Email = @email");
    const result = await pool
      .request()
      .input("probName", sql.NVarChar, ProbName)
      .input("probDesc", sql.NVarChar, ProbDesc)
      .input("eventId", sql.Int, EventId)
      .input("isAvail", sql.NVarChar, "false")
      .query(insertProblemStatement);
    await pool
      .request()
      .input("probId", sql.Int, result.recordset[0].ProbId)
      .input("teamId", sql.Int, employee.recordset[0].TeamId)
      .input("eventId", sql.Int, EventId)
      .query(
        "UPDATE Teams SET ProbId=@probId WHERE TeamId=@teamId AND EventId=@eventId"
      );
  }
});

app.put("/finishPhase", async (req, res) => {
  console.log(req.body);
  const { eventId, currentPhaseKey, nextPhaseKey } = req.body;

  const pool = await sql.connect(config);

  console.log(currentPhaseKey);

  if (currentPhaseKey === "results") {
    const finish = await pool.query(
      ` UPDATE TIMELINE
        SET
        ${currentPhaseKey} = 'completed'
        WHERE event_id = ${eventId}`
    );
    res.send({ message: "timeline updated successfully" });
  } else {
    const finish = await pool.query(
      ` UPDATE TIMELINE
        SET
        ${currentPhaseKey} = 'completed',
        ${nextPhaseKey} = 'active'
        WHERE event_id = ${eventId}`
    );

    res.send({ message: "timeline updated successfully" });
  }
});

app.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return resp
        .status(400)
        .json({ error: "Email and password are required." });
    }

    // Establish connection with the SQL Server
    const pool = await sql.connect(config);

    // Use parameterized query to prevent SQL injection
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(
        "SELECT username, user_id, email, password, role FROM [USER] WHERE email = @email"
      );

    // Check if user exists
    const user = result.recordset[0];

    console.log(user);
    if (!user) {
      return resp.status(401).json({ error: "Invalid credentials" });
    }

    // Compare hashed password with provided password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return resp.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send response with the token and user role
    return resp.json({
      token,
      userRole: user.role,
      userData: { name: user.username, mail: user.email, userId: user.user_id },
    });
  } catch (error) {
    console.error("Error with retrieving data from table:", error);
    resp.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addEmployee", async (req, res) => {
  res.send(req.body);
});

// app.post("/saveAndPublishEvent", upload.single("file"), async (req, resp) => {
//   // const { name, rules, prizes, dates,lastDateModified,problemStatements,teamSize } = req.body.eventData;

//   const { name, rules, prizes, dates, isPublished, lastDateModified, problemStatements, teamSize, userId } = JSON.parse(req.body.eventData);
//   const file = req.file

//   console.log('Request body from frontend: ', JSON.parse(req.body.eventData))

//   const pool = await sql.connect(config);
//   let supabaseResponse;

//   if(isPublished === 'true'){
//     if (!file) return resp.status(400).send("No file uploaded.");

//     const { data, error } = await supabase.storage
//     .from("PDIDocuments")
//     .upload(`images/${name}`, file.buffer, {
//       contentType: file.mimetype,
//     });

//   if (error) {
//     console.log(error);
//     return resp.status(500).send({ errorr: error.message });
//   }

//   supabaseResponse = supabase.storage
//     .from("PDIDocuments")
//     .getPublicUrl(`images/${name}`);
//   }

//   const organizerResult = await pool.request().query(`
//       SELECT organizer_id FROM ORGANIZER WHERE user_id = ${userId}
//   `)

//   const organizerId = organizerResult.recordset[0].organizer_id

//   const result = await pool
//     .request()
//     .input("eventName", sql.NVarChar, name)
//     .input("rules", sql.Text, rules)
//     .input("first", sql.NVarChar, prizes.first)
//     .input("second", sql.NVarChar, prizes.second)
//     .input("third", sql.NVarChar, prizes.third)
//     .input("status", sql.NVarChar, 'Upcoming')
//     .input("posterLink", sql.NVarChar, supabaseResponse ? (supabaseResponse.data.publicUrl): null )
//     .input("organizerId", sql.Int, organizerId)
//     .input("isPublished", sql.NVarChar, isPublished)
//     .input("lastModifiedDate", sql.NVarChar, lastDateModified)
//     .input('teamSize', sql.Int, teamSize)
//     .input('registrationStart', sql.DateTime, dates.startRegistration)
//     .input('registrationEnd', sql.DateTime, dates.registrationEnd)
//     .input('chooseProblem', sql.DateTime, dates.chooseProblem || null)
//     .input('designSubmission', sql.DateTime, dates.designSubmission)
//     .input('projectSubmission', sql.DateTime, dates.projectSubmission)
//     .input('reviewSubmissions', sql.DateTime, dates.reviewSubmissions)
//     .input('results', sql.DateTime, dates.results)
//     .query(insertEvents);

//   if(problemStatements.length !== 0){
//     const values = problemStatements
//     .map(ps => `('${ps.title}', '${ps.description}', ${parseInt(result.recordset[0].event_id)})`)
//     .join(", ");

//     const query = `
//       INSERT INTO PROBLEM (problem_name, problem_description, event_id)
//       OUTPUT INSERTED.problem_id
//       VALUES ${values};
//     `;

//     await pool
//       .request()
//       .query(query);
//   }

//   resp.send({
//     eventId: result.recordset[0].event_id,
//     msg: "Got event successfully",
//   });
// });

app.post("/saveAndPublishEvent", upload.single("file"), async (req, resp) => {
  const {
    name,
    rules,
    prizes,
    dates,
    isPublished,
    lastDateModified,
    problemStatements,
    teamSize,
    userId,
  } = JSON.parse(req.body.eventData);
  console.log(req.body.eventData)
  const file = req.file;

  const pool = await sql.connect(config);
  let supabaseResponse;

  if (isPublished === "true") {
    if (!file) return resp.status(400).send("No file uploaded.");

    const { data, error } = await supabase.storage
      .from("PDIDocuments")
      .upload(`images/${name}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      return resp.status(500).send({ errorr: error.message });
    }

    supabaseResponse = supabase.storage
      .from("PDIDocuments")
      .getPublicUrl(`images/${name}`);
  }

  const organizerResult = await pool.request().query(`
      SELECT organizer_id FROM ORGANIZER WHERE user_id = ${userId}
  `);

  const organizerId = organizerResult.recordset[0].organizer_id;

  const result = await pool
    .request()
    .input("eventName", sql.NVarChar, name)
    .input("rules", sql.Text, rules)
    .input("first", sql.NVarChar, prizes.first)
    .input("second", sql.NVarChar, prizes.second)
    .input("third", sql.NVarChar, prizes.third)
    .input("status", sql.NVarChar, "Upcoming")
    .input(
      "posterLink",
      sql.NVarChar,
      supabaseResponse ? supabaseResponse.data.publicUrl : null
    )
    .input("organizerId", sql.Int, organizerId)
    .input("isPublished", sql.NVarChar, isPublished)
    .input("lastModifiedDate", sql.NVarChar, lastDateModified || null)
    .input("teamSize", sql.Int, teamSize)
    .input("registrationStart", sql.DateTime, dates.startRegistration || null)
    .input("registrationEnd", sql.DateTime, dates.registrationEnd || null)
    .input("chooseProblem", sql.DateTime, dates.chooseProblem || null)
    .input("designSubmission", sql.DateTime, dates.designSubmission || null)
    .input("projectSubmission", sql.DateTime, dates.projectSubmission || null)
    .input("reviewSubmissions", sql.DateTime, dates.reviewSubmissions || null)
    .input("results", sql.DateTime, dates.results || null)
    .query(insertEvents);

  if (problemStatements.length !== 0) {
    const values = problemStatements
      .map(
        (ps) =>
          `('${ps.title}', '${ps.description}', ${parseInt(
            result.recordset[0].event_id
          )})`
      )
      .join(", ");

    const query = `
      INSERT INTO PROBLEM (problem_name, problem_description, event_id)
      OUTPUT INSERTED.problem_id
      VALUES ${values};
    `;

    await pool.request().query(query);
  }

  if (isPublished === "true") {
    const timelineQuery = `
      INSERT INTO TIMELINE (
        registration_start, registration_end, problem_selection, design_submission, project_submission, review, results, event_id
      ) VALUES (
        'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', ${result.recordset[0].event_id}
      );
    `;

    await pool.request().query(timelineQuery);
  }

  resp.send({
    eventId: result.recordset[0].event_id,
    msg: "Got event successfully",
  });
});

app.post("/documentSub", upload.single("file"), async (req, res) => {
  const file = req.file;
  const { userId, eventId } = JSON.parse(req.body.userAndEventDetails);
  const pool = await sql.connect(config);

  console.log('file is ', file)
  console.log('userId is ', userId)
  console.log('eventId is ', eventId)

  const particpant = await pool
    .request()
    .input("userId", sql.Int, parseInt(userId))
    .input("eventId", sql.Int, parseInt(eventId))
    .query(
      "SELECT participant_id FROM PARTICIPANT WHERE user_id = @userId AND event_id=@eventId"
    );

    console.log('participant is ', particpant)

  const team= await pool
    .request()
    .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
    .query("SELECT team_id from TEAM_MEMBER WHERE participant_id=@participantId")

  const getTeamName=await pool
  .request()
  .input("teamId",sql.Int,parseInt(team.recordset[0].team_id))
  .input("eventId", sql.Int, parseInt(eventId))
  .query("select team_name from TEAM where team_id=@teamId AND event_id=@eventId")

  const selectedProblemId=await pool
  .request()
  .input("teamId",sql.Int,parseInt(team.recordset[0].team_id))
  .input("eventId", sql.Int, parseInt(eventId))
  .query("SELECT problem_id from TEAM where team_id=@teamId AND event_id=@eventId")

  if (!file) return res.status(400).send("No file uploaded.");

  const { data, error } = await supabase.storage
    .from("PDIDocuments")
    .upload(`uploads/${getTeamName.recordset[0].team_name}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) return res.status(500).send({ error: error.message });

  const { data: publicUrlData } = supabase.storage
    .from("PDIDocuments")
    .getPublicUrl(`uploads/${getTeamName.recordset[0].team_name}`);

  const result = await pool
    .request()
    .input("teamId", sql.Int, parseInt(team.recordset[0].team_id))
    .input("eventId", sql.Int, parseInt(eventId))
    .input("problemId", sql.Int, parseInt(selectedProblemId.recordset[0].problem_id))
    .input("DocumentLink", sql.NVarChar, publicUrlData.publicUrl)
    .input("docSubDate", sql.DateTime, new Date())
    .query("INSERT INTO SUBMISSION (team_id,problem_id, document_link,event_id, doc_sub_date) VALUES (@teamId,@problemId, @DocumentLink,@eventId,@docSubDate);");

  console.log("Data inserted successfully:", result);

  res.status(200).send({
    message: "File uploaded successfully.",
  });
});

app.post("/addImage", upload.single("file"), async (req, res) => {
  const file = req.file;
  const pool = await sql.connect(config);

  if (!file) return res.status(400).send("No file uploaded.");

  const { data, error } = await supabase.storage
    .from("PDIDocuments")
    .upload(`images/${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) return res.status(500).send({ error: error.message });

  const { data: publicUrlData } = supabase.storage
    .from("PDIDocuments")
    .getPublicUrl(`images/${file.originalname}`);

  // const result = await pool
  //   .request()
  //   .input("teamId", sql.Int, parseInt(teamId))
  //   .input("eventId", sql.Int, parseInt(eventId))
  //   .input("DocumentUrl", sql.NVarChar, publicUrlData.publicUrl)
  //   .query(docSubmit);

  // console.log("Data inserted successfully:", result);

  res.status(200).send({
    message: "File uploaded successfully.",
    publicUrl: publicUrlData.publicUrl,
  });
});

// app.post("/codeSubmission", async (req, res) => {
//   const { CodeRepoLink, CodeDemoLink, TeamId, EventId } = req.body;
//   const pool = await sql.connect(config);
//   const document = await pool.request().input("TeamId", sql.Int, TeamId).query(`
//                   SELECT * FROM ProjectDocuments WHERE TeamId=@TeamId
//                   `);
//   const result = await pool
//     .request()
//     .input("RepoLink", sql.NVarChar, CodeRepoLink)
//     .input("DemoLink", sql.NVarChar, CodeDemoLink)
//     .input("TeamId", sql.Int, TeamId)
//     .input("EventId", sql.Int, EventId)
//     .input("DocumentId", sql.Int, document.recordset[0].DocumentId)
//     .query(codeSubmit);

//   res.send("Data Inserted Successfully!");
// });

app.post("/getTeamMemebers", async (req, res) => {
  const { email, eventId } = req.body;
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .input("EmailId", sql.NVarChar, email)
    .input("EventId", sql.Int, eventId)
    .query(
      "SELECT TeamId FROM EventParticipants WHERE Email = @EmailId AND EventId=@EventId"
    );
  const teamNameResult = await pool
    .request()
    .input("EventId", sql.Int, eventId)
    .input("TeamId", sql.Int, result.recordset[0].TeamId)
    .query(
      "SELECT TeamName FROM Teams WHERE TeamId = @TeamId AND EventId=@EventId"
    );
  const teamMemberResult = await pool
    .request()
    .input("EventId", sql.Int, eventId)
    .input("TeamId", sql.Int, result.recordset[0].TeamId)
    .query(
      "SELECT Name,Email,TeamMember FROM EventParticipants WHERE TeamId = @TeamId AND EventId=@EventId"
    );

  res.send({
    Email: email,
    TeamName: teamNameResult.recordset[0].TeamName,
    TeamMembers: teamMemberResult.recordset,
  });
});

// PUT requests
app.put("/problemSelect", async (req, res) => {
  const { user_id,eventId, ProbId } = req.body;
  console.log(req.body);
  const pool = await sql.connect(config);
  const particpant = await pool
    .request()
    .input("userId", sql.Int, parseInt(user_id))
    .input("eventId", sql.Int, parseInt(eventId))
    .query(
      "SELECT participant_id FROM PARTICIPANT WHERE user_id = @userId AND event_id=@eventId"
    );

  const team= await pool
    .request()
    .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
    .query("SELECT team_id from TEAM_MEMBER WHERE participant_id=@participantId")
  
  const result = await pool
    .request()
    .input("eventId", sql.Int, parseInt(eventId))
    .input("probId", sql.Int, parseInt(ProbId))
    .input("teamId", sql.Int, parseInt(team.recordset[0].team_id))
    .query(
      "UPDATE TEAM SET problem_id=@probId WHERE team_id=@teamId AND event_id=@eventId"
    );
  res.send({ status: "success", msg: "Data Updated Successfully!" });
});

// app.put("/employeeSelect/:empid", async (req, res) => {
//   const { empid } = req.params;
//   const pool = await sql.connect(config);
//   const employee = await pool
//     .request()
//     .input("empid", sql.Int, parseInt(empid))
//     .input("isSelected", sql.NVarChar, "true")
//     .query("UPDATE Employees SET IsSelected=@isSelected WHERE EmpId = @empid");
//   res.send({ status: "success", msg: "Employee Updated Successfully!" });
// });

// app.put("/selectProblem/:probId", async (req, res) => {
//   const { probId } = req.params;
//   const pool = await sql.connect(config);

//   const result = pool
//     .request()
//     .query(
//       `UPDATE ProblemStatements SET IsAvailable = 'false' WHERE ProbId = ${probId}`
//     );

//   res.send({ message: "Problem chosen succesfully" });
// });

app.put("/saveDraft/:draftId", upload.single("file"), async (req, resp) => {
  // const { name, rules, prizes, dates,lastDateModified,problemStatements,teamSize } = req.body.eventData;

  const { draftId } = req.params;
  const {
    name,
    rules,
    prizes,
    dates,
    isPublished,
    lastDateModified,
    problemStatements,
    teamSize,
    userId,
    poster,
  } = JSON.parse(req.body.eventData);
  const file = req.file;

  const pool = await sql.connect(config);
  let supabaseResponse;

  if (isPublished === "true") {
    if (!file) return resp.status(400).send("No file uploaded.");

    const { data, error } = await supabase.storage
      .from("PDIDocuments")
      .upload(`images/${name}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      return resp.status(500).send({ errorr: error.message });
    }

    supabaseResponse = supabase.storage
      .from("PDIDocuments")
      .getPublicUrl(`images/${name}`);
  }

  const organizerResult = await pool.request().query(`
      SELECT organizer_id FROM ORGANIZER WHERE user_id = ${userId}
  `);

  const organizerId = organizerResult.recordset[0].organizer_id;

  const result = await pool
    .request()
    .input("eventName", sql.NVarChar, name)
    .input("rules", sql.Text, rules)
    .input("first", sql.NVarChar, prizes.first)
    .input("second", sql.NVarChar, prizes.second)
    .input("third", sql.NVarChar, prizes.third)
    .input("status", sql.NVarChar, "Upcoming")
    .input(
      "posterLink",
      sql.NVarChar,
      supabaseResponse ? supabaseResponse.data.publicUrl : null
    )
    .input("organizerId", sql.Int, organizerId)
    .input("isPublished", sql.NVarChar, isPublished)
    .input("lastModifiedDate", sql.NVarChar, lastDateModified)
    .input("teamSize", sql.Int, teamSize)
    .input("registrationStart", sql.DateTime, dates.startRegistration)
    .input("registrationEnd", sql.DateTime, dates.registrationEnd)
    .input("chooseProblem", sql.DateTime, dates.chooseProblem || null)
    .input("designSubmission", sql.DateTime, dates.designSubmission)
    .input("projectSubmission", sql.DateTime, dates.projectSubmission)
    .input("reviewSubmissions", sql.DateTime, dates.reviewSubmissions)
    .input("results", sql.DateTime, dates.results)
    .query(updateEventQuery);

  if (problemStatements.length !== 0) {
    const values = problemStatements
      .map(
        (ps) =>
          `('${ps.title}', '${ps.description}', ${parseInt(
            result.recordset[0].event_id
          )})`
      )
      .join(", ");

    const query = `
      INSERT INTO PROBLEM (problem_name, problem_description, event_id)
      OUTPUT INSERTED.problem_id
      VALUES ${values};
    `;

    await pool.request().query(query);
  }

  resp.send({
    eventId: result.recordset[0].event_id,
    msg: "Got event successfully",
  });
});

app.put("/saveDraftNew/:draftId", upload.single("file"), async (req, resp) => {
  const { draftId } = req.params;
  console.log("Draft ID is ", draftId);
  console.log("Request body is ", req.body);

  const {
    name,
    rules,
    prizes,
    dates,
    isPublished,
    lastDateModified,
    problemStatements,
    teamSize,
    userId,
    poster,
  } = req.body;
  const file = req.file;

  const pool = await sql.connect(config);
  let supabaseResponse;

  if (isPublished === "true") {
    if (!file) return resp.status(400).send("No file uploaded.");

    const { data, error } = await supabase.storage
      .from("PDIDocuments")
      .upload(`images/${name}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      return resp.status(500).send({ error: error.message });
    }

    supabaseResponse = supabase.storage
      .from("PDIDocuments")
      .getPublicUrl(`images/${name}`);
  }

  const organizerResult = await pool.request().query(`
      SELECT organizer_id FROM ORGANIZER WHERE user_id = ${userId}
  `);

  const organizerId = organizerResult.recordset[0].organizer_id;

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
  WHERE event_id = ${draftId};
`;

  const result = await pool
    .request()
    .input("eventName", sql.NVarChar, name)
    .input("rules", sql.Text, rules)
    .input("first", sql.NVarChar, prizes.first)
    .input("second", sql.NVarChar, prizes.second)
    .input("third", sql.NVarChar, prizes.third)
    .input("status", sql.NVarChar, "Upcoming")
    .input(
      "posterLink",
      sql.NVarChar,
      supabaseResponse ? supabaseResponse.data.publicUrl : null
    )
    .input("organizerId", sql.Int, organizerId)
    .input("isPublished", sql.NVarChar, isPublished)
    .input("lastModifiedDate", sql.NVarChar, lastDateModified)
    .input("teamSize", sql.Int, teamSize)
    .input("registrationStart", sql.DateTime, dates.startRegistration)
    .input("registrationEnd", sql.DateTime, dates.registrationEnd)
    .input("chooseProblem", sql.DateTime, dates.chooseProblem || null)
    .input("designSubmission", sql.DateTime, dates.designSubmission)
    .input("projectSubmission", sql.DateTime, dates.projectSubmission)
    .input("reviewSubmissions", sql.DateTime, dates.reviewSubmissions)
    .input("results", sql.DateTime, dates.results)
    .query(updateEventQuery);

  if (problemStatements.length !== 0) {
    // Fetch existing problem statements for the event
    const existingProblems = await pool.request().query(`
        SELECT problem_id, problem_name FROM PROBLEM WHERE event_id = ${draftId}
      `);

    // Map database problems into a usable format
    const existingProblemsArray = existingProblems.recordset.map((ps) => ({
      problem_id: ps.problem_id,
      problem_name: ps.problem_name,
    }));

    // Extract problem names from the submitted problem statements
    const submittedProblemNames = problemStatements.map((ps) => ps.title);

    // Find problems to delete: those in the database but not in the submitted data
    const problemsToDelete = existingProblemsArray.filter(
      (prob) => !submittedProblemNames.includes(prob.problem_name)
    );

    // Delete the identified problems
    if (problemsToDelete.length > 0) {
      const deleteProblemIds = problemsToDelete
        .map((prob) => prob.problem_id)
        .join(", ");
      const deleteQuery = `
          DELETE FROM PROBLEM WHERE problem_id IN (${deleteProblemIds})
        `;
      await pool.request().query(deleteQuery);
    }

    // Iterate over submitted problem statements to insert or update
    for (const problem of problemStatements) {
      const existingProblem = existingProblemsArray.find(
        (prob) => prob.problem_name === problem.title
      );

      if (existingProblem) {
        // Update the existing problem based on its problem_id
        await pool
          .request()
          .input("problemId", sql.Int, existingProblem.problem_id)
          .input("problemName", sql.NVarChar, problem.title)
          .input("problemDescription", sql.Text, problem.description).query(`
              UPDATE PROBLEM
              SET problem_name = @problemName,
                  problem_description = @problemDescription
              WHERE problem_id = @problemId
            `);
      } else {
        // Insert a new problem
        await pool
          .request()
          .input("problemName", sql.NVarChar, problem.title)
          .input("problemDescription", sql.Text, problem.description)
          .input("eventId", sql.Int, draftId).query(`
              INSERT INTO PROBLEM (problem_name, problem_description, event_id)
              VALUES (@problemName, @problemDescription, @eventId)
            `);
      }
    }
  }

  resp.send({
    // eventId: result.recordset[0].event_id,
    msg: "Draft saved successfully",
  });
});

app.put("/updateAndPublishEvent", upload.single("file"), async (req, resp) => {
  const {
    name,
    rules,
    prizes,
    dates,
    lastDateModified,
    problemStatements,
    teamSize,
    userId,
    eventId,
  } = JSON.parse(req.body.eventData);
  const file = req.file;

  const pool = await sql.connect(config);
  let supabaseResponse;

  if (file) {
    const { data, error } = await supabase.storage
      .from("PDIDocuments")
      .upload(`images/${name}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log(error);
      return resp.status(500).send({ error: error.message });
    }

    supabaseResponse = supabase.storage
      .from("PDIDocuments")
      .getPublicUrl(`images/${name}`);
  }

  const organizerResult = await pool.request().query(`
      SELECT organizer_id FROM ORGANIZER WHERE user_id = ${userId}
  `);

  const organizerId = organizerResult.recordset[0].organizer_id;

  const result = await pool
    .request()
    .input("eventId", sql.Int, eventId)
    .input("eventName", sql.NVarChar, name)
    .input("rules", sql.Text, rules)
    .input("first", sql.NVarChar, prizes.first)
    .input("second", sql.NVarChar, prizes.second)
    .input("third", sql.NVarChar, prizes.third)
    .input("status", sql.NVarChar, "Upcoming")
    .input(
      "posterLink",
      sql.NVarChar,
      supabaseResponse ? supabaseResponse.data.publicUrl : null
    )
    .input("organizerId", sql.Int, organizerId)
    .input("isPublished", sql.NVarChar, "true")
    .input("lastModifiedDate", sql.NVarChar, lastDateModified)
    .input("teamSize", sql.Int, teamSize)
    .input("registrationStart", sql.DateTime, dates.startRegistration)
    .input("registrationEnd", sql.DateTime, dates.registrationEnd)
    .input("chooseProblem", sql.DateTime, dates.chooseProblem || null)
    .input("designSubmission", sql.DateTime, dates.designSubmission)
    .input("projectSubmission", sql.DateTime, dates.projectSubmission)
    .input("reviewSubmissions", sql.DateTime, dates.reviewSubmissions)
    .input("results", sql.DateTime, dates.results)
    .query(updateAndPublishEventQuery);

  if (problemStatements.length !== 0) {
    await pool
      .request()
      .query(`DELETE FROM PROBLEM WHERE event_id = ${eventId}`);

    const values = problemStatements
      .map((ps) => `('${ps.title}', '${ps.description}', ${eventId})`)
      .join(", ");

    const query = `
      INSERT INTO PROBLEM (problem_name, problem_description, event_id)
      OUTPUT INSERTED.problem_id
      VALUES ${values};
    `;

    await pool.request().query(query);
  }

  resp.send({
    eventId,
    msg: "Event updated and published successfully",
  });
});

app.put("/codeSubmission", async (req, res) => {
  const { CodeRepoLink, CodeDemoLink, userId, eventId } = req.body;
  console.log('code submission body is ', req.body)
  const pool = await sql.connect(config);

  const particpant = await pool
    .request()
    .input("userId", sql.Int, parseInt(userId))
    .input("eventId", sql.Int, parseInt(eventId))
    .query(
      "SELECT participant_id FROM PARTICIPANT WHERE user_id = @userId AND event_id=@eventId"
    );

    console.log('participant is ', particpant)

  const team= await pool
    .request()
    .input("participantId",sql.Int,parseInt(particpant.recordset[0].participant_id))
    .query("SELECT team_id from TEAM_MEMBER WHERE participant_id=@participantId")

  const result = await pool
    .request()
    .input("RepoLink", sql.NVarChar, CodeRepoLink)
    .input("DemoLink", sql.NVarChar, CodeDemoLink)
    .input("TeamId", sql.Int, parseInt(team.recordset[0].team_id))
    .input("EventId", sql.Int, parseInt(eventId))
    .input("projectSubDate", sql.DateTime, new Date())
    .query("UPDATE SUBMISSION SET repository_link=@RepoLink, live_link=@DemoLink, proj_sub_date=@projectSubDate WHERE team_id=@TeamId AND event_id=@EventId");

  res.send({ message: "Data Inserted Successfully!"});
});

// Example: Add a sample document
async function createSampleDocument() {
  let hashed = await bcrypt.hash("Password", 10);
  const Emp = new Employee({
    EmailId: "Organizer@gmail.com",
    EmpId: "Emp001",
    Role: "Organizer",
    Location: "Hyderbad",
    Password: hashed,
  });
  await Emp.save();
  console.log("Sample document inserted:", Emp);
}

app.listen(5000, () => {
  console.log("running on server");
});
