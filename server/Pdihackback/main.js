const express = require("express");
const cors = require("cors");
const config = require("./config");
const {
  createEmployeesTable,
  createEventTable,
  createEventDates,
  createEventParticipants,
  getEventsData,
  getEmployeeData,

} = require("./Model/Schema");
const sql = require("mssql");
const app = express();

app.use(cors());
app.use(express.json());

async function createTables() {
  try {
    const pool = await sql.connect(config);
    console.log("Connected to SQL Server");

    // Create the Employees table with a foreign key referencing Departments
    await pool.request().query(createEventTable);
    console.log("Events table created");

    await pool.request().query(createEventDates);
    console.log("Events Dates table created");

    await pool.request().query(createEventParticipants);
    console.log("Events Participants table created");

    await sql.close();
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}
// createTables()

async function insertData() {
  try {
    const pool = await sql.connect(config);

    // Insert into Employees table with valid department_id
    //   await pool.request().query("INSERT INTO Events(Name,Rules,First,Second,Third,Past,Ongoing,Future) VALUES ('Innovation Challenge 2024','<p>This is the code of conduct and rules for the event.</p>','$1000','$500','$200','false','false','true');");
    //   console.log("Inserted data into EventsDates Table");
    //
    await pool
      .request()
      .query(
        "INSERT INTO EventParticipants(EventId,Name,Email,EmpId,TeamLead,TeamMember) VALUES (2,'Employee1','Employee1@gmail.com',4,'false','false');"
      );
    console.log("Inserted data into EventsDates Table");
    await sql.close();
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

//   insertData();

app.get("/getData", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const data = await pool.request().query(getEmployeeData);
    console.log('data is : ',data.recordset)
  } catch (error) {
    console.error("Error with retrieving data from Employee table : ", error);
  }
});

app.get("/", (req, res) => {
  res.send("working");
});

app.post("/login", async (req, resp) => {
  try {
    // const { email, password } = req.body;
    const pool = await sql.connect(config);
    const data = await pool.request().query(getEmployeeData);
    console.log('data is : ',data)
  } catch (error) {
    console.error("Error with retrieving data from table : ", error);
  }

  //   const data = await Employee.find({});
  //   const user = data.find((u) => u.EmailId === email);
  //   console.log("working", req.body);
    // if (user && (await bcrypt.compare(password, user.Password))) {
    //   const token = jwt.sign(
    //     { username: user.EmailId, role: user.Role },
    //     JWT_SECRET,
    //     { expiresIn: "1h" }
    //   );
    //   return resp.json({ token, userRole: user.Role });
    // }
    // resp.status(401).json({ error: "Invalid credentials" });
});

app.listen(5000, () => {
  console.log("running on server");
});
