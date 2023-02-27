const { sequelize } = require("./config");
const { theatres } = require("../data/theatres");
const { users } = require("../data/users");

const seedTheatresDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS theatre;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

    // User
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL
    );
    `);

    let userInsertQuery =
      "INSERT INTO user (username, password, email, role) VALUES ";

    let userInsertQueryVariables = [];

    users.forEach((user, index, array) => {
      let string = "(";
      for (let i = 1; i < 5; i++) {
        string += `$${userInsertQueryVariables.length + i}`;
        if (i < 4) string += ",";
      }
      userInsertQuery += string + ")";
      if (index < array.length - 1) userInsertQuery += ",";

      const variables = [user.username, user.password, user.email, user.role];
      userInsertQueryVariables = [...userInsertQueryVariables, ...variables];
    });

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery, {
      bind: userInsertQueryVariables,
    });

    const [userResponse, metadata] = await sequelize.query(
      "SELECT username, id FROM user"
    );
    console.log(userResponse.id);
    //Theatres

    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS theatre (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          theatreName TEXT NOT NULL,
          address TEXT NOT NULL,
          phoneNumber TEXT NOT NULL,
          desc TEXT,
          email TEXT NOT NULL,
          reviews TEXT,
          fk_user_id INTEGER NOT NULL,
          FOREIGN KEY(fk_user_id) REFERENCES user(id)
        );
        `);

    let theatreInsertQuery =
      "INSERT INTO theatre (theatreName, address, phoneNumber, desc, email, reviews, fk_user_id) VALUES ";

    let theatreInsertQueryVariables = [];

    theatres.forEach((theatre, index, array) => {
      let string = "(";
      for (let i = 1; i < 8; i++) {
        string += `$${theatreInsertQueryVariables.length + i}`;
        if (i < 7) string += ",";
      }
      theatreInsertQuery += string + ")";
      if (index < array.length - 1) theatreInsertQuery += ",";

      const variables = [
        theatre.theatreName,
        theatre.address,
        theatre.phoneNumber,
        theatre.desc,
        theatre.email,
        theatre.reviews,
      ];

      console.log(userResponse);
      const userId = userResponse.find(
        (user) => user.username === theatre.owner
      );

      variables.push(userId.id);
      theatreInsertQueryVariables = [
        ...theatreInsertQueryVariables,
        ...variables,
      ];
    });

    theatreInsertQuery += ";";

    await sequelize.query(theatreInsertQuery, {
      bind: theatreInsertQueryVariables,
    });

    //Tabell 3
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedTheatresDb();
