const createUserTable = `
CREATE TABLE USER (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(255)
);
`

